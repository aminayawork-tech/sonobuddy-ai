import RevenueCat

// Product IDs must match exactly what is configured in App Store Connect
// and attached to the "pro" entitlement in the RevenueCat dashboard.
let iapProductIDs: Set<String> = ["sonobuddyai_pro_monthly", "sonobuddyai_pro_yearly"]

// TODO: confirm this matches the entitlement identifier configured in
// app.revenuecat.com → Entitlements.
let proEntitlementID = "pro"

@MainActor
class StoreManager {
    static let shared = StoreManager()

    func purchase(productID: String, completion: @escaping (Bool, String?) -> Void) {
        Purchases.shared.getOfferings { offerings, error in
            if let error = error {
                completion(false, error.localizedDescription)
                return
            }
            guard let package = offerings?.current?.availablePackages.first(where: {
                $0.storeProduct.productIdentifier == productID
            }) else {
                completion(false, "Product not found. Make sure the offering is configured in RevenueCat and App Store Connect.")
                return
            }

            Purchases.shared.purchase(package: package) { _, customerInfo, error, userCancelled in
                if userCancelled {
                    completion(false, nil) // nil = cancelled, not an error
                } else if let error = error {
                    completion(false, error.localizedDescription)
                } else if customerInfo?.entitlements[proEntitlementID]?.isActive == true {
                    completion(true, productID)
                } else {
                    completion(false, "Purchase completed but the Pro entitlement is not active.")
                }
            }
        }
    }
}
