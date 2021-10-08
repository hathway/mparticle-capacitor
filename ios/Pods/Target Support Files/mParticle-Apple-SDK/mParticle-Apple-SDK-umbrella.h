#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "MPKitProtocol.h"
#import "MPIHasher.h"
#import "MPForwardRecord.h"
#import "MPBaseEvent.h"
#import "MPProduct.h"
#import "MPListenerController.h"
#import "MPExtensionProtocol.h"
#import "MPKitExecStatus.h"
#import "MPKitAPI.h"
#import "MPEnums.h"
#import "MPGDPRConsent.h"
#import "NSDictionary+MPCaseInsensitive.h"
#import "MParticleUser.h"
#import "MPCommerceEventInstruction.h"
#import "NSArray+MPCaseInsensitive.h"
#import "MPTransactionAttributes+Dictionary.h"
#import "MPTransactionAttributes.h"
#import "MPListenerProtocol.h"
#import "FilteredMParticleUser.h"
#import "MPAliasRequest.h"
#import "MPCommerceEvent.h"
#import "MPCommerceEvent+Dictionary.h"
#import "MPIdentityApiRequest.h"
#import "MPConsentState.h"
#import "MPIdentityApi.h"
#import "MPAliasResponse.h"
#import "MPPromotion.h"
#import "MPDateFormatter.h"
#import "MPCCPAConsent.h"
#import "MPKitRegister.h"
#import "MPProduct+Dictionary.h"
#import "FilteredMPIdentityApiRequest.h"
#import "MPUserSegments.h"
#import "MPEvent.h"
#import "mParticle.h"

FOUNDATION_EXPORT double mParticle_Apple_SDKVersionNumber;
FOUNDATION_EXPORT const unsigned char mParticle_Apple_SDKVersionString[];

