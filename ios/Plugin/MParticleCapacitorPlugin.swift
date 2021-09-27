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

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        let mParticleOptions = MParticleOptions(key: "us1-279d6248523ab840bb39cfc8d4799691", secret: "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7")
        mParticleOptions.dataPlanId = "master_data_plan"
        mParticleOptions.dataPlanVersion = 2
        // //Please see the Identity page for more information on building this object
         let request = MPIdentityApiRequest()
         request.email = "email21@wearehathway.com"
         mParticleOptions.identifyRequest = request
         mParticleOptions.onIdentifyComplete = { (apiResult, error) in
             NSLog("Identify complete. userId = %@ error = %@", apiResult?.user.userId.stringValue ?? "Null User ID", error?.localizedDescription ?? "No Error Available")
         }

        //Start the SDK
        MParticle.sharedInstance().start(with: mParticleOptions)
        return true
    }

    // func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    //     dump("APP LOAD *************")
    //     //initialize mParticle
    //     let options = MParticleOptions(key: "us1-279d6248523ab840bb39cfc8d4799691",
    //                                         secret: "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7")     
    //     MParticle.sharedInstance().start(with: options)
            
    //     return true
    // }

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

        self.notifyListeners("mParticleInit", data: ["value":"I am init'd"])
        let value = call.getString("value") ?? ""
        dump("i am ios mparticleinit call:")
        dump(value)
        call.resolve([
            "value": implementation.echo(value)
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
        dump("helloMP iOS")
        call.resolve([
            "value": implementation.echo("hello from mParticle")
        ])
    }
}
