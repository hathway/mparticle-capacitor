import Foundation
import mParticle_Apple_SDK;
import Capacitor

@objc public class MParticleCapacitor: NSObject {

    @objc public func echo(_ value: String) -> String {
        return value
    }

    @objc public func getSecret(_ value: String) -> String {
        if (value == "us1-279d6248523ab840bb39cfc8d4799691") {
            return "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7"
        } else if (value == "us1-8f90c2f3b594d842a381ecfd0c48e3d4") {
            return "s9v9vHIIdGejfjM4rkTy9l3C5GzDZFiDyzXeHG3pkv1XUzNgLPSIFXtgFyf3Z9gS"
        } else if (value == "us1-887d1179105c1242b116c1d06f4b64ab") {
            return "qbJ8hQ2uPRi2umU4FJrJdyROK1GXs5ByGPzxf48KWZAosN4bnb0l-XJFe8ZbXfE1"
        } else if (value == "us1-b132b53006362f44a25a0d17c710ea33") {
            return "r_iPlAytcRdf0LzwpvEdz10BUIwMzi_zBddVMKqQbEWHvHZZ_MaCSt3mkXgWO8ft"
        }
        return value
    }

    @objc public func currentUser() -> MParticleUser? {
        return MParticle.sharedInstance().identity.currentUser
    }

    @objc public func identityRequest(_ email:String,_ customerId:String) -> MPIdentityApiRequest? {
        let identityRequest = MPIdentityApiRequest.withEmptyUser()
        identityRequest.email = email
        identityRequest.customerId = customerId
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
            name: dataDict["name"] as! String,
            sku: "\(dataDict["sku"] ?? 0)",
            quantity: dataDict["quantity"] as! NSNumber,
            price: (dataDict["cost"] as? NSNumber) ?? nil
        )
        if let attrs = dataDict["attributes"] as? Dictionary<String, JSValue> {
            for attr in attrs {
                product[attr.key] = "\(attr.value)"
            }
        }
        return product
    }
}
