import WebKit

func handlePushPermission() {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
        switch settings.authorizationStatus {
        case .notDetermined:
            let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
            UNUserNotificationCenter.current().requestAuthorization(options: authOptions) { success, error in
                if error == nil {
                    returnPermissionResult(isGranted: success)
                    if success {
                        DispatchQueue.main.async {
                            UIApplication.shared.registerForRemoteNotifications()
                        }
                    }
                } else {
                    returnPermissionResult(isGranted: false)
                }
            }
        case .denied:
            returnPermissionResult(isGranted: false)
        case .authorized, .ephemeral, .provisional:
            returnPermissionResult(isGranted: true)
        @unknown default:
            return
        }
    }
}

func handlePushState() {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
        switch settings.authorizationStatus {
        case .notDetermined:  returnPermissionState(state: "notDetermined")
        case .denied:         returnPermissionState(state: "denied")
        case .authorized:     returnPermissionState(state: "authorized")
        case .ephemeral:      returnPermissionState(state: "ephemeral")
        case .provisional:    returnPermissionState(state: "provisional")
        @unknown default:     returnPermissionState(state: "unknown")
        }
    }
}

func returnPermissionResult(isGranted: Bool) {
    let detail = isGranted ? "granted" : "denied"
    DispatchQueue.main.async {
        SonoPilot.webView.evaluateJavaScript(
            "this.dispatchEvent(new CustomEvent('push-permission-request', { detail: '\(detail)' }))"
        )
    }
}

func returnPermissionState(state: String) {
    DispatchQueue.main.async {
        SonoPilot.webView.evaluateJavaScript(
            "this.dispatchEvent(new CustomEvent('push-permission-state', { detail: '\(state)' }))"
        )
    }
}

func checkViewAndEvaluate(event: String, detail: String) {
    if !SonoPilot.webView.isHidden && !SonoPilot.webView.isLoading {
        DispatchQueue.main.async {
            SonoPilot.webView.evaluateJavaScript(
                "this.dispatchEvent(new CustomEvent('\(event)', { detail: \(detail) }))"
            )
        }
    } else {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            checkViewAndEvaluate(event: event, detail: detail)
        }
    }
}

func sendPushToWebView(userInfo: [AnyHashable: Any]) {
    guard let jsonData = try? JSONSerialization.data(withJSONObject: userInfo),
          let json = String(data: jsonData, encoding: .utf8) else { return }
    checkViewAndEvaluate(event: "push-notification", detail: json)
}

func sendPushClickToWebView(userInfo: [AnyHashable: Any]) {
    guard let jsonData = try? JSONSerialization.data(withJSONObject: userInfo),
          let json = String(data: jsonData, encoding: .utf8) else { return }
    checkViewAndEvaluate(event: "push-notification-click", detail: json)
}
