import Foundation
import mParticle_Apple_SDK;

@objc public class MParticleCapacitor: NSObject {
    @objc public func echo(_ value: String) -> String {
        return value
    }

    @objc public func currentUser() -> AnyObject {
        return MParticle.sharedInstance().identity.currentUser
    }
}
