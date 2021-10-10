import Foundation
import Capacitor
import mParticle_Apple_SDK;

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(MParticleCapacitorPlugin)
public class MParticleCapacitorPlugin: CAPPlugin {
    private let implementation = MParticleCapacitor()

    @objc func mParticleInit(_ call: CAPPluginCall) {
        let options = MParticleOptions(key: "us1-279d6248523ab840bb39cfc8d4799691",
                                    secret: "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7")
        let identityRequest = MPIdentityApiRequest.withEmptyUser()
        identityRequest.email = "foos@wearehathway.com"
        identityRequest.customerId = "12345690"
        dump("************************* HERE *******************")
        dump(identityRequest)
        options.identifyRequest = identityRequest
        dump(options.onIdentifyComplete)
        options.onIdentifyComplete =  {(result: MPIdentityApiResult?, error: Error?) in
            if (result?.user != nil) {
                dump("**************************MADE IT")
                dump(result)
                result?.user.setUserAttribute("example attribute key", value: "example attribute value")
            } else {
                dump("**************************FAILED")
                //handle failure - see below
            }
        }

        MParticle.sharedInstance().start(with: options)

        // self.notifyListeners("mParticleInit", data: ["value":"I am init'd"])
        // let value = call.getString("value") ?? ""
        // dump("i am ios mparticleinit call:")
        // dump(value)
        call.resolve([
            "value": "ios mparticle initialized"
        ])
    }

    @objc func loginMParticleUser(_ call: CAPPluginCall) {
        // call.unimplemented("Not implemented on iOS.")
        let email = call.getString("email") ?? "email"
        let customerId = call.getString("customerId") ?? "id"
        MParticle.sharedInstance().identity.login(implementation.identityRequest(email,customerId)!, completion: implementation.identityCallback)
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

    @objc func setUserAttributeList(_ call: CAPPluginCall) {
        call.unimplemented("Not implemented on iOS.")
        // let name:String = call.getString("attributeName") ?? "default name"
        // let list = call.getArray("attributeValues") ?? []
        // let listArr:[String] = []
        // for str in list {
        //     listArr.append(str.as[String])
        // }

        // implementation.currentUser()?.setUserAttributeList(name, values: listArr)
        // call.resolve([
        //     "value":"success",
        // ])
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
