import UIKit
import WebKit
import AuthenticationServices
import SafariServices
import PhotosUI


func createWebView(container: UIView, WKSMH: WKScriptMessageHandler, WKND: WKNavigationDelegate, NSO: NSObject, VC: ViewController) -> WKWebView{

    let config = WKWebViewConfiguration()
    let userContentController = WKUserContentController()

    userContentController.add(WKSMH, name: "print")
    userContentController.add(WKSMH, name: "push-subscribe")
    userContentController.add(WKSMH, name: "push-permission-request")
    userContentController.add(WKSMH, name: "push-permission-state")
    userContentController.add(WKSMH, name: "push-token")
    userContentController.add(WKSMH, name: "openCamera")
    userContentController.add(WKSMH, name: "openGallery")
    userContentController.add(WKSMH, name: "openPurchase")
    userContentController.add(WKSMH, name: "restorePurchases")

    config.userContentController = userContentController

    config.limitsNavigationsToAppBoundDomains = true;
    config.allowsInlineMediaPlayback = true
    config.preferences.javaScriptCanOpenWindowsAutomatically = true
    config.preferences.setValue(true, forKey: "standalone")
    
    let webView = WKWebView(frame: calcWebviewFrame(webviewView: container, toolbarView: nil), configuration: config)
    setCustomCookie(webView: webView)

    webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    webView.isHidden = true;
    webView.navigationDelegate = WKND
    webView.scrollView.bounces = false
    webView.scrollView.contentInsetAdjustmentBehavior = .never
    webView.allowsBackForwardNavigationGestures = true
    
    // Check if macCatalyst 16.4+ is available and if so, enable web inspector.
    // This allows the web app to be inspected using Safari Web Inspector. Supported on iOS 16.4+ and macOS 13.3+
    if #available(iOS 16.4, macOS 13.3, *) {
        webView.isInspectable = true
    }
    
    let deviceModel = UIDevice.current.model
    let osVersion = UIDevice.current.systemVersion
    webView.configuration.applicationNameForUserAgent = "Safari/604.1"
    webView.customUserAgent = "Mozilla/5.0 (\(deviceModel); CPU \(deviceModel) OS \(osVersion.replacingOccurrences(of: ".", with: "_")) like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/\(osVersion) Mobile/15E148 Safari/604.1 PWAShell"

    webView.addObserver(NSO, forKeyPath: #keyPath(WKWebView.estimatedProgress), options: NSKeyValueObservingOptions.new, context: nil)
    
    #if DEBUG
    if #available(iOS 16.4, *) {
        webView.isInspectable = true
    }
    #endif
    
    return webView
}

func setAppStoreAsReferrer(contentController: WKUserContentController) {
    let scriptSource = "document.referrer = `app-info://platform/ios-store`;"
    let script = WKUserScript(source: scriptSource, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
    contentController.addUserScript(script);
}

func setCustomCookie(webView: WKWebView) {
    let _platformCookie = HTTPCookie(properties: [
        .domain: rootUrl.host!,
        .path: "/",
        .name: platformCookie.name,
        .value: platformCookie.value,
        .secure: "FALSE",
        .expires: NSDate(timeIntervalSinceNow: 31556926)
    ])!

    webView.configuration.websiteDataStore.httpCookieStore.setCookie(_platformCookie)

}

func calcWebviewFrame(webviewView: UIView, toolbarView: UIToolbar?) -> CGRect{
    if ((toolbarView) != nil) {
        return CGRect(x: 0, y: toolbarView!.frame.height, width: webviewView.frame.width, height: webviewView.frame.height - toolbarView!.frame.height)
    }
    else {
        let winScene = UIApplication.shared.connectedScenes.first
        let windowScene = winScene as! UIWindowScene
        var statusBarHeight = windowScene.statusBarManager?.statusBarFrame.height ?? 0

        switch displayMode {
        case "fullscreen":
            #if targetEnvironment(macCatalyst)
                if let titlebar = windowScene.titlebar {
                    titlebar.titleVisibility = .hidden
                    titlebar.toolbar = nil
                }
            #endif
            return CGRect(x: 0, y: 0, width: webviewView.frame.width, height: webviewView.frame.height)
        default:
            #if targetEnvironment(macCatalyst)
            statusBarHeight = 29
            #endif
            let windowHeight = webviewView.frame.height - statusBarHeight
            return CGRect(x: 0, y: statusBarHeight, width: webviewView.frame.width, height: windowHeight)
        }
    }
}

extension ViewController: WKUIDelegate, WKDownloadDelegate {
    // redirect new tabs to main webview
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if (navigationAction.targetFrame == nil) {
            webView.load(navigationAction.request)
        }
        return nil
    }
    // restrict navigation to target host, open external links in 3rd party apps
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if (navigationAction.request.url?.scheme == "about") {
            return decisionHandler(.allow)
        }
        if (navigationAction.shouldPerformDownload || navigationAction.request.url?.scheme == "blob") {
            return decisionHandler(.download)
        }

        if let requestUrl = navigationAction.request.url{
            if let requestHost = requestUrl.host {
                // NOTE: Match auth origin first, because host origin may be a subset of auth origin and may therefore always match
                let matchingAuthOrigin = authOrigins.first(where: { requestHost.range(of: $0) != nil })
                if (matchingAuthOrigin != nil) {
                    decisionHandler(.allow)
                    if (toolbarView.isHidden) {
                        toolbarView.isHidden = false
                        webView.frame = calcWebviewFrame(webviewView: webviewView, toolbarView: toolbarView)
                    }
                    return
                }

                let matchingHostOrigin = allowedOrigins.first(where: { requestHost.range(of: $0) != nil })
                if (matchingHostOrigin != nil) {
                    // Open in main webview
                    decisionHandler(.allow)
                    if (!toolbarView.isHidden) {
                        toolbarView.isHidden = true
                        webView.frame = calcWebviewFrame(webviewView: webviewView, toolbarView: nil)
                    }
                    return
                }

                // External URL — cancel webview navigation, open in Safari
                decisionHandler(.cancel)
                if ["http", "https"].contains(requestUrl.scheme?.lowercased() ?? "") {
                    let safariViewController = SFSafariViewController(url: requestUrl)
                    self.present(safariViewController, animated: true, completion: nil)
                } else if UIApplication.shared.canOpenURL(requestUrl) {
                    UIApplication.shared.open(requestUrl)
                }
            } else {
                decisionHandler(.cancel)
                if (navigationAction.request.url?.scheme == "tel" || navigationAction.request.url?.scheme == "mailto" ){
                    if (UIApplication.shared.canOpenURL(requestUrl)) {
                        UIApplication.shared.open(requestUrl)
                    }
                }
                else {
                    if requestUrl.isFileURL {
                        // not tested
                        downloadAndOpenFile(url: requestUrl.absoluteURL)
                    }
                    // if (requestUrl.absoluteString.contains("base64")){
                    //     downloadAndOpenBase64File(base64String: requestUrl.absoluteString)
                    // }
                }
            }
        }
        else {
            decisionHandler(.cancel)
        }

    }
    // Handle javascript: `window.alert(message: String)`
    func webView(_ webView: WKWebView,
        runJavaScriptAlertPanelWithMessage message: String,
        initiatedByFrame frame: WKFrameInfo,
        completionHandler: @escaping () -> Void) {

        // Set the message as the UIAlertController message
        let alert = UIAlertController(
            title: nil,
            message: message,
            preferredStyle: .alert
        )

        // Add a confirmation action “OK”
        let okAction = UIAlertAction(
            title: "OK",
            style: .default,
            handler: { _ in
                // Call completionHandler
                completionHandler()
            }
        )
        alert.addAction(okAction)

        // Display the NSAlert
        present(alert, animated: true, completion: nil)
    }
    // Handle javascript: `window.confirm(message: String)`
    func webView(_ webView: WKWebView,
        runJavaScriptConfirmPanelWithMessage message: String,
        initiatedByFrame frame: WKFrameInfo,
        completionHandler: @escaping (Bool) -> Void) {

        // Set the message as the UIAlertController message
        let alert = UIAlertController(
            title: nil,
            message: message,
            preferredStyle: .alert
        )

        // Add a confirmation action “Cancel”
        let cancelAction = UIAlertAction(
            title: "Cancel",
            style: .cancel,
            handler: { _ in
                // Call completionHandler
                completionHandler(false)
            }
        )

        // Add a confirmation action “OK”
        let okAction = UIAlertAction(
            title: "OK",
            style: .default,
            handler: { _ in
                // Call completionHandler
                completionHandler(true)
            }
        )
        alert.addAction(cancelAction)
        alert.addAction(okAction)

        // Display the NSAlert
        present(alert, animated: true, completion: nil)
    }
    // Handle javascript: `window.prompt(prompt: String, defaultText: String?)`
    func webView(_ webView: WKWebView,
        runJavaScriptTextInputPanelWithPrompt prompt: String,
        defaultText: String?,
        initiatedByFrame frame: WKFrameInfo,
        completionHandler: @escaping (String?) -> Void) {

        // Set the message as the UIAlertController message
        let alert = UIAlertController(
            title: nil,
            message: prompt,
            preferredStyle: .alert
        )

        // Add a confirmation action “Cancel”
        let cancelAction = UIAlertAction(
            title: "Cancel",
            style: .cancel,
            handler: { _ in
                // Call completionHandler
                completionHandler(nil)
            }
        )

        // Add a confirmation action “OK”
        let okAction = UIAlertAction(
            title: "OK",
            style: .default,
            handler: { _ in
                // Call completionHandler with Alert input
                if let input = alert.textFields?.first?.text {
                    completionHandler(input)
                }
            }
        )

        alert.addTextField { textField in
            textField.placeholder = defaultText
        }
        alert.addAction(cancelAction)
        alert.addAction(okAction)

        // Display the NSAlert
        present(alert, animated: true, completion: nil)
    }

    func downloadAndOpenFile(url: URL){

        let destinationFileUrl = url
        let sessionConfig = URLSessionConfiguration.default
        let session = URLSession(configuration: sessionConfig)
        let request = URLRequest(url:url)
        let task = session.downloadTask(with: request) { (tempLocalUrl, response, error) in
            if let tempLocalUrl = tempLocalUrl, error == nil {
                if let statusCode = (response as? HTTPURLResponse)?.statusCode {
                    print("Successfully download. Status code: \(statusCode)")
                }
                do {
                    try FileManager.default.copyItem(at: tempLocalUrl, to: destinationFileUrl)
                    self.openFile(url: destinationFileUrl)
                } catch (let writeError) {
                    print("Error creating a file \(destinationFileUrl) : \(writeError)")
                }
            } else {
                print("Error took place while downloading a file. Error description: \(error?.localizedDescription ?? "N/A") ")
            }
        }
        task.resume()
    }

    // func downloadAndOpenBase64File(base64String: String) {
    //     // Split the base64 string to extract the data and the file extension
    //     let components = base64String.components(separatedBy: ";base64,")

    //     // Make sure the base64 string has the correct format
    //     guard components.count == 2, let format = components.first?.split(separator: "/").last else {
    //         print("Invalid base64 string format")
    //         return
    //     }

    //     // Remove the data type prefix to get the base64 data
    //     let dataString = components.last!

    //     if let imageData = Data(base64Encoded: dataString) {
    //         let documentsUrl: URL  =  FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    //         let destinationFileUrl = documentsUrl.appendingPathComponent("image.\(format)")

    //         do {
    //             try imageData.write(to: destinationFileUrl)
    //             self.openFile(url: destinationFileUrl)
    //         } catch {
    //             print("Error writing image to file url: \(destinationFileUrl): \(error)")
    //         }
    //     }
    // }

    func openFile(url: URL) {
        self.documentController = UIDocumentInteractionController(url: url)
        self.documentController?.delegate = self
        self.documentController?.presentPreview(animated: true)
    }

    // Custom file picker for <input type="file"> — requires iOS 18.4+
    // On iOS 15–18.3 the native WKWebView photo picker handles it automatically
    @available(iOS 18.4, *)
    func webView(_ webView: WKWebView,
                 runOpenPanelWith parameters: WKOpenPanelParameters,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping ([URL]?) -> Void) {
        filePickerCompletion = completionHandler
        let alert = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            alert.addAction(UIAlertAction(title: "Camera", style: .default) { [weak self] _ in
                self?.presentImagePicker(sourceType: .camera)
            })
        }
        alert.addAction(UIAlertAction(title: "Photo Library", style: .default) { [weak self] _ in
            self?.presentPhotoPicker()
        })
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { [weak self] _ in
            self?.filePickerCompletion?(nil)
            self?.filePickerCompletion = nil
        })
        present(alert, animated: true)
    }

    // The system photo picker (PHPicker) opens much faster than
    // UIImagePickerController's library mode and needs no Photos permission.
    func presentPhotoPicker() {
        var config = PHPickerConfiguration()
        config.filter = .images
        config.selectionLimit = 1
        config.preferredAssetRepresentationMode = .current
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = self
        present(picker, animated: true)
    }

    func presentImagePicker(sourceType: UIImagePickerController.SourceType) {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = self
        present(picker, animated: true)
    }

    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
        download.delegate = self
    }

    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse,
                suggestedFilename: String,
                completionHandler: @escaping (URL?) -> Void) {

        let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let fileURL = documentsPath.appendingPathComponent(suggestedFilename)

        // Remove existing file if it exists, otherwise it may show an old file/content just by having the same name.
        if FileManager.default.fileExists(atPath: fileURL.path) {
            try? FileManager.default.removeItem(at: fileURL)
        }

        self.openFile(url: fileURL)
        completionHandler(fileURL)
    }
}

extension ViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    // Resize to ≤1200px on the longest side and encode as a JPEG data URL.
    // Safe to call off the main thread.
    static func webDataURL(for image: UIImage) -> String? {
        let maxPx: CGFloat = 1200
        let s = min(1.0, maxPx / max(image.size.width, image.size.height))
        let sz = CGSize(width: image.size.width * s, height: image.size.height * s)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        let resized = UIGraphicsImageRenderer(size: sz, format: format).image { _ in
            image.draw(in: CGRect(origin: .zero, size: sz))
        }
        guard let data = resized.jpegData(compressionQuality: 0.85) else { return nil }
        return "data:image/jpeg;base64,\(data.base64EncodedString())"
    }

    // Tell the page an image is on its way (shows a spinner), then deliver it
    // via a JS event — bypasses WKWebView sandbox file access.
    func sendImageLoadingToWeb() {
        SonoPilot.webView.evaluateJavaScript("window.dispatchEvent(new Event('native-image-loading'));") { _, _ in }
    }

    func sendImageToWeb(_ dataURL: String?) {
        let js = dataURL.map { "window.dispatchEvent(new CustomEvent('native-image-selected',{detail:'\($0)'}));" }
            ?? "window.dispatchEvent(new Event('native-image-cancelled'));"
        SonoPilot.webView.evaluateJavaScript(js) { _, _ in }
    }

    func imagePickerController(_ picker: UIImagePickerController,
                               didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        let completion = filePickerCompletion
        filePickerCompletion = nil
        let image = (info[.editedImage] ?? info[.originalImage]) as? UIImage
        // Dismiss right away; resize/encode in the background so the UI never freezes.
        picker.dismiss(animated: true)
        guard let image = image else { completion?(nil); return }
        sendImageLoadingToWeb()
        DispatchQueue.global(qos: .userInitiated).async {
            let dataURL = ViewController.webDataURL(for: image)
            DispatchQueue.main.async {
                self.sendImageToWeb(dataURL)
                completion?(nil)
            }
        }
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
        filePickerCompletion?(nil)
        filePickerCompletion = nil
    }
}

extension ViewController: PHPickerViewControllerDelegate {
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        let completion = filePickerCompletion
        filePickerCompletion = nil
        picker.dismiss(animated: true)
        guard let provider = results.first?.itemProvider,
              provider.canLoadObject(ofClass: UIImage.self) else {
            completion?(nil)
            return
        }
        sendImageLoadingToWeb()
        // loadObject calls back on a background queue — encode there.
        provider.loadObject(ofClass: UIImage.self) { object, _ in
            let dataURL = (object as? UIImage).flatMap { ViewController.webDataURL(for: $0) }
            DispatchQueue.main.async {
                self.sendImageToWeb(dataURL)
                completion?(nil)
            }
        }
    }
}

// MARK: - Hide the keyboard's form accessory bar (the ⌃ ⌄ ✓ toolbar)
//
// WKWebView shows a "previous / next / done" bar above the keyboard for web
// inputs, which overlaps our chat input. Swap the web content view's class for
// a subclass whose inputAccessoryView is nil (same approach as Capacitor's and
// Cordova's keyboard plugins).
private final class NoInputAccessoryHelper: NSObject {
    @objc var inputAccessoryView: AnyObject? { return nil }
}

extension WKWebView {
    func hideInputAccessoryBar() {
        guard let contentView = scrollView.subviews.first(where: {
            String(describing: type(of: $0)).hasPrefix("WKContent")
        }) else { return }

        let subclassName = "\(type(of: contentView))_NoInputAccessory"
        var subclass: AnyClass? = NSClassFromString(subclassName)
        if subclass == nil, let baseClass = object_getClass(contentView) {
            subclass = objc_allocateClassPair(baseClass, subclassName, 0)
            guard let newClass = subclass,
                  let method = class_getInstanceMethod(NoInputAccessoryHelper.self,
                                                       #selector(getter: NoInputAccessoryHelper.inputAccessoryView))
            else { return }
            class_addMethod(newClass,
                            #selector(getter: NoInputAccessoryHelper.inputAccessoryView),
                            method_getImplementation(method),
                            method_getTypeEncoding(method))
            objc_registerClassPair(newClass)
        }
        if let newClass = subclass {
            object_setClass(contentView, newClass)
        }
    }
}
