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

    // public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    //     // Override point for customization after application launch.
    //     dump("MADE IT HERE APPLICATION IN CAPPLUGIN")
    //     let options = MParticleOptions(key: "us1-279d6248523ab840bb39cfc8d4799691",
    //                                 secret: "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7")
    //     options.logLevel = MPILogLevel.verbose
    //     MParticle.sharedInstance().start(with: options)
    //     return true
    // }

    @objc func mParticleInit(_ call: CAPPluginCall) {
        // call.unimplemented("not implemented for testing")
        dump("************ INSIDE CAPACITOR PLUGIN mParticleInit")
        let options = MParticleOptions(key: "us1-279d6248523ab840bb39cfc8d4799691",
                                    secret: "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7")
        // let identityRequest = MPIdentityApiRequest.withEmptyUser()
        // identityRequest.email = "foos@wearehathway.com"
        // identityRequest.customerId = "12345690"
        // dump("************************* HERE *******************")
        // dump(identityRequest)
        // options.identifyRequest = identityRequest
        // dump(options.onIdentifyComplete)
        // options.onIdentifyComplete =  {(result: MPIdentityApiResult?, error: Error?) in
        //     if (result?.user != nil) {
        //         // dump("**************************MADE IT")
        //         dump(result)
        //         result?.user.setUserAttribute("example attribute key", value: "example attribute value")
        //     } else {
        //         dump("**************************FAILED")
        //         //handle failure - see below
        //     }
        // }
        options.logLevel = MPILogLevel.verbose
        MParticle.sharedInstance().start(with: options)
        call.resolve([
            "value": "ios mparticle initialized"
        ])
    }

    @objc func loginMParticleUser(_ call: CAPPluginCall) {
        let email = call.getString("email") ?? "email"
        let customerId = call.getString("customerId") ?? "id"
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


    @objc func logMParticleEvent(_ call: CAPPluginCall) {
        let name = call.getString("eventName") ?? "default name"
        let type =  UInt(call.getInt("eventType") ?? 0)
        let props = call.getObject("eventProperties") ?? [:]
        // dump("**************** logEvent Called ***************")
        // dump(call.getString("eventName"))
        // dump(call.getInt("eventType"))
        // dump(call.getObject("eventProperties"))
        // dump("***********************************************")
        if let event = MPEvent(name: name, type: MPEventType.init(rawValue:type) ?? MPEventType.other) {
            event.customAttributes = props
            MParticle.sharedInstance().logEvent(event)
        }
        call.resolve([
            "value":"success",
        ])
    }

    @objc func logMParticlePageView(_ call: CAPPluginCall) {
        let name = call.getString("pageName") ?? "default name"
        let screenInfo = ["page": call.getString("pageLink") ?? "link"];

        MParticle.sharedInstance().logScreen(name, eventInfo: screenInfo)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func setUserAttribute(_ call: CAPPluginCall) {
        // call.unimplemented("Not implemented on iOS.")
        let name = call.getString("attributeName") ?? "default name"
        let value = call.getString("attributeValue") ?? "default value"

        implementation.currentUser()?.setUserAttribute(name, value: value)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func getUserAttributeLists(_ call: CAPPluginCall) {
        // call.unimplemented("Not implemented on iOS.")
        dump("********************** HERE GETATTRIBUTES *************")
        // dump(implementation.currentUser()?.userSegments(1000,endpointId:"")
        dump(implementation.currentUser()?.userAttributes)
        call.resolve(
            implementation.currentUser()?.userAttributes ?? [:]
        )
    }

    @objc func setUserAttributeList(_ call: CAPPluginCall) {
        call.unimplemented("Not implemented on iOS.")
        // let name:String = call.getString("attributeName") ?? "default name"
        // let list = call.getObject("attributeValues") ?? [:]
        // var listArr:[String] = []
        // for str in list {
        //     listArr.append(str as String)
        // }
        // implementation.currentUser()?.setUserAttributeList(name, values: listArr)
        // call.resolve([
        //     "value":"success",
        // ])
    }

    @objc func updateMParticleCart(_ call: CAPPluginCall) {
        // call.unimplemented("Not implemented on iOS.")
        let product_tmp = call.getObject("product") ?? [:]
        let cust_attr = call.getObject("customAttributes") ?? [:]
        let type_tmp = UInt(call.getInt("eventType") ?? 0) - 1

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
        // call.unimplemented("Not implemented on iOS.")
        let product_tmp = call.getObject("product") ?? [:]
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
        // call.unimplemented("Not implemented on iOS.")
        let product_tmp = call.getObject("product") ?? [:]
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
//        call.unimplemented("Not implemented on iOS.")
        let products_tmp = call.getArray("productData") ?? []
        let cust_attr = call.getObject("customAttributes") ?? [:]
        let trans_tmp = call.getObject("transactionAttributes") ?? [:]
        
        dump(cust_attr)

        let action =  MPCommerceEventAction.checkout
        let event = MPCommerceEvent.init(action: action)
        dump(products_tmp)
        for product in products_tmp {
            dump(product)
            event?.addProduct(implementation.createMParticleProduct(product as AnyObject))
        }

        dump(trans_tmp)
        let attributes = MPTransactionAttributes.init()
        attributes.transactionId = trans_tmp["Id"] as? String
        attributes.revenue = trans_tmp["Revenue"] as? NSNumber
        attributes.tax = trans_tmp["Tax"] as? NSNumber
        
        dump(attributes)
        
        event?.customAttributes = cust_attr
        event?.transactionAttributes = attributes
        MParticle.sharedInstance().logEvent(event!)
        call.resolve([
            "value":"success",
        ])
    }

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        dump("i am ios:")
        dump(value)
        call.resolve([
            "value": implementation.echo(value)
        ])
    }

    @objc func helloMP(_ call: CAPPluginCall) {
        call.unimplemented("Not implemented on iOS.")
        // dump("helloMP iOS")
        // call.resolve([
        //     "value": implementation.echo("hello from mParticle")
        // ])
    }
}
