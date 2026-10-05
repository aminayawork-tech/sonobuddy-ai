import StoreKit

// Product IDs must match exactly what is configured in App Store Connect.
let iapProductIDs: Set<String> = ["sonobuddyai_pro_monthly", "sonobuddyai_pro_yearly"]

@MainActor
class StoreManager {
    static let shared = StoreManager()

    private(set) var products: [Product] = []
    private var transactionListener: Task<Void, Never>?

    /// Call once at app launch. Listens for transaction updates that happen
    /// outside an explicit purchase() call — renewals, cancellations,
    /// refunds, and purchases made on another device (Family Sharing).
    /// Whenever one lands, it notifies the web app the same way a live
    /// purchase does, so the Supabase profile stays in sync.
    func startTransactionListener(onUpdate: @escaping (String) -> Void) {
        transactionListener?.cancel()
        transactionListener = Task.detached { [weak self] in
            for await result in Transaction.updates {
                guard case .verified(let transaction) = result else { continue }
                await transaction.finish()
                await MainActor.run {
                    onUpdate("\(transaction.id)|\(transaction.productID)")
                }
                _ = self
            }
        }
    }

    func loadProducts() async {
        do {
            products = try await Product.products(for: iapProductIDs)
        } catch {
            print("[StoreManager] Failed to load products: \(error)")
        }
    }

    func purchase(productID: String, completion: @escaping (Bool, String?) -> Void) {
        Task {
            if products.isEmpty { await loadProducts() }
            guard let product = products.first(where: { $0.id == productID }) else {
                completion(false, "Product not found. Make sure IAP is configured in App Store Connect.")
                return
            }
            do {
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        await transaction.finish()
                        // Pass transactionId|productId back for server sync
                        completion(true, "\(transaction.id)|\(productID)")
                    case .unverified(_, let error):
                        completion(false, "Verification failed: \(error.localizedDescription)")
                    }
                case .userCancelled:
                    completion(false, nil) // nil = cancelled, not an error
                case .pending:
                    completion(false, "Purchase is pending approval.")
                @unknown default:
                    completion(false, "Unknown purchase result.")
                }
            } catch {
                completion(false, error.localizedDescription)
            }
        }
    }

    /// Re-syncs with the App Store and reports the current active
    /// subscription, if any. Used by the "Restore Purchases" button —
    /// required by App Store review for any app selling subscriptions.
    func restorePurchases(completion: @escaping (Bool, String?) -> Void) {
        Task {
            do {
                try await AppStore.sync()
            } catch {
                completion(false, error.localizedDescription)
                return
            }

            for await result in Transaction.currentEntitlements {
                guard case .verified(let transaction) = result,
                      iapProductIDs.contains(transaction.productID) else { continue }
                completion(true, "\(transaction.id)|\(transaction.productID)")
                return
            }
            completion(false, "No active subscription found for this Apple ID.")
        }
    }
}
