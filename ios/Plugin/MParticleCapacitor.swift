import Foundation
import mParticle_Apple_SDK;
import Capacitor

@objc public class MParticleCapacitor: NSObject {

    @objc public func echo(_ value: String) -> String {
        return value
    }

    @objc public func currentUser() -> MParticleUser? {
        return MParticle.sharedInstance().identity.currentUser
    }

    @objc public func identityRequest(_ email:String,_ customerId:String) -> MPIdentityApiRequest? {
        let identityRequest = MPIdentityApiRequest.withEmptyUser()
        identityRequest.email = email
        if !customerId.isEmpty {
           identityRequest.customerId = customerId
        }
        return identityRequest
    }

    let identityCallback = {(result: MPIdentityApiResult?, error: Error?) in
        if (result?.user != nil) {
            //IDSync request succeeded, mutate attributes or query for the MPID as needed
            // result?.user.setUserAttribute("example attribute key", value: "example attribute value")
        } else {
            NSLog(error!.localizedDescription)
            let resultCode = MPIdentityErrorResponseCode(rawValue: UInt((error! as NSError).code))
            switch (resultCode!) {
            case .clientNoConnection,
                .clientSideTimeout:
                //retry the IDSync request
                break;
            case .requestInProgress,
                .retry:
                //inspect your implementation if this occurs frequency
                //otherwise retry the IDSync request
                break;
            default:
                // inspect error.localizedDescription to determine why the request failed
                // this typically means an implementation issue
                break;
            }
        }
    }

    @objc public func createMParticleProduct(_ productData:AnyObject) -> MPProduct {
        let dataDict = productData as! [String: Any]
        let product = MPProduct.init(
            name: (dataDict["name"] as? String) ?? "",
            sku: "\(dataDict["sku"] ?? 0)",
            quantity: (dataDict["quantity"] as? NSNumber) ?? 0,
            price: (dataDict["cost"] as? NSNumber) ?? 0
        )
        if let attrs = dataDict["attributes"] as? Dictionary<String, JSValue> {
            for attr in attrs {
                product[attr.key] = "\(attr.value)"
            }
        }
        return product
    }
}
