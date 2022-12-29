import Foundation
import Capacitor
import mParticle_Apple_SDK

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(MParticleCapacitorPlugin)
public class MParticleCapacitorPlugin: CAPPlugin {
    private let implementation = MParticleCapacitor()

    @objc func mParticleInit(_ call: CAPPluginCall) {
        call.unimplemented("Moved for Braze compatability")
        // let key = call.getString("key") ?? ""
        // let secret = call.getString("secret") ?? ""
        // let options = MParticleOptions(key: key,
        //                             secret: secret)
        // options.logLevel = MPILogLevel.verbose
        // options.proxyAppDelegate = false
        // MParticle.sharedInstance().start(with: options)
        // call.resolve([
        //     "value": "ios mparticle initialized"
        // ])
    }

    @objc func loginMParticleUser(_ call: CAPPluginCall) {
        let email = call.getString("email") ?? ""
        let customerId = call.getString("customerId") ?? ""
        MParticle.sharedInstance().identity.login(implementation.identityRequest(email,customerId)!, completion: implementation.identityCallback)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func logoutMParticleUser(_ call: CAPPluginCall) {
        // call.unimplemented("Not implemented on iOS.")
        MParticle.sharedInstance().identity.logout(completion: implementation.identityCallback)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func registerMParticleUser(_ call: CAPPluginCall) {
        let email = call.getString("email") ?? ""
        let customerId = call.getString("customerId") ?? ""
        let userAttributes = call.getObject("userAttributes") ?? [:]

        MParticle.sharedInstance().identity.login(implementation.identityRequest(email,customerId)!, completion: { (result: MPIdentityApiResult?, error: Error?) -> () in
            if (result?.user != nil) {
                for (key,value) in userAttributes {
                    result?.user.setUserAttribute(key, value: value)
                }
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
        })
        call.resolve([
            "value":"success",
        ])
    }

    @objc func logMParticleEvent(_ call: CAPPluginCall) {
        let name = call.getString("eventName") ?? ""
        let type =  UInt(call.getInt("eventType") ?? 0)
        let props = call.getObject("eventProperties") ?? [:]
        if let event = MPEvent(name: name, type: MPEventType.init(rawValue:type) ?? MPEventType.other) {
            event.customAttributes = props
            MParticle.sharedInstance().logEvent(event)
        }
        call.resolve([
            "value":"success",
        ])
    }

    @objc func logMParticlePageView(_ call: CAPPluginCall) {
        let name = call.getString("pageName") ?? ""
        let screenInfo = ["page": call.getString("pageLink") ?? ""];

        MParticle.sharedInstance().logScreen(name, eventInfo: screenInfo)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func getAllUserAttributes(_ call: CAPPluginCall) {
        let attr = implementation.currentUser()?.userAttributes;
        call.resolve([
            "value": attr ?? ""
        ])
    }

    @objc func setUserAttribute(_ call: CAPPluginCall) {
        let name = call.getString("attributeName") ?? ""
        let value = call.getString("attributeValue") ?? ""

        implementation.currentUser()?.setUserAttribute(name, value: value)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func setUserAttributeList(_ call: CAPPluginCall) {
        let name:String = call.getString("attributeName") ?? ""
        let list:[String] = call.getArray("attributeValues") as? [String] ?? []
        implementation.currentUser()?.setUserAttributeList(name, values: list)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func updateMParticleCart(_ call: CAPPluginCall) {
        let product_tmp = call.getObject("productData") ?? [:]
        let cust_attr = call.getObject("customAttributes") ?? [:]
        let type_tmp = UInt(call.getInt("eventType") ?? 1) - 1 // TODO: Need to edit enum types

        let action = MPCommerceEventAction.init(rawValue:type_tmp) ?? MPCommerceEventAction.addToCart
        let product = implementation.createMParticleProduct(product_tmp as AnyObject)
        let attributes = MPTransactionAttributes.init()
        let event = MPCommerceEvent.init(action: action, product: product)
        event.customAttributes = cust_attr
        event.transactionAttributes = attributes
        MParticle.sharedInstance().logEvent(event)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func addMParticleProduct(_ call: CAPPluginCall) {
        let product_tmp = call.getObject("productData") ?? [:]
        let cust_attr = call.getObject("customAttributes") ?? [:]

        let action =  MPCommerceEventAction.addToCart
        let product = implementation.createMParticleProduct(product_tmp as AnyObject)
        let attributes = MPTransactionAttributes.init()
        let event = MPCommerceEvent.init(action: action, product: product)
        event.customAttributes = cust_attr
        event.transactionAttributes = attributes
        MParticle.sharedInstance().logEvent(event)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func removeMParticleProduct(_ call: CAPPluginCall) {
        let product_tmp = call.getObject("productData") ?? [:]
        let cust_attr = call.getObject("customAttributes") ?? [:]

        let action =  MPCommerceEventAction.removeFromCart
        let product = implementation.createMParticleProduct(product_tmp as AnyObject)
        let attributes = MPTransactionAttributes.init()

        let event = MPCommerceEvent.init(action: action, product: product)
        event.customAttributes = cust_attr
        event.transactionAttributes = attributes
        
        MParticle.sharedInstance().logEvent(event)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func submitPurchaseEvent(_ call: CAPPluginCall) {
        let products_tmp = call.getArray("productData") ?? []
        let cust_attr = call.getObject("customAttributes") ?? [:]
        let trans_tmp = call.getObject("transactionAttributes") ?? [:]
        
        let action =  MPCommerceEventAction.purchase
        let event = MPCommerceEvent.init(action: action)
        for product in products_tmp {
            event?.addProduct(implementation.createMParticleProduct(product as AnyObject))
        }

        let attributes = MPTransactionAttributes.init()
        attributes.transactionId = trans_tmp["Id"] as? String
        attributes.revenue = trans_tmp["Revenue"] as? NSNumber
        attributes.tax = trans_tmp["Tax"] as? NSNumber
                
        event?.customAttributes = cust_attr
        event?.transactionAttributes = attributes
        MParticle.sharedInstance().logEvent(event!)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
}
