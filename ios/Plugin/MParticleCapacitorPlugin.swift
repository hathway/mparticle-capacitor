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

    @objc func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        dump("application function ios here")
       // Override point for customization after application launch.
        let mParticleOptions = MParticleOptions(key: "us1-b9b520a131dc88448a30babf911b1b51", secret: "_z5GNaX49Nw4c787tBFSmimjZS88Cd_8RVnfxC99cFNbnpFFJxfit_rTL6LA1yP8")
        
       //Please see the Identity page for more information on building this object
        let request = MPIdentityApiRequest()
        request.email = "anth92121@wearehathway.com"
        mParticleOptions.identifyRequest = request
        mParticleOptions.onIdentifyComplete = { (apiResult, error) in
            NSLog("Identify complete. userId = %@ error = %@", apiResult?.user.userId.stringValue ?? "Null User ID", error?.localizedDescription ?? "No Error Available")
        }
        
       //Start the SDK
        MParticle.sharedInstance().start(with: mParticleOptions)
        
       return true
    }

    @objc func mParticleInit(_ call: CAPPluginCall) {
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
