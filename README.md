# mparticle-capacitor

mParticle Capacitor Plugin

## Install

```
npm install npm i @hathway/mparticle-capacitor
npx cap sync
```

## Initialize

### Web (Angular)

Use `mParticleConfig` to create a configuration object used to initialize mParticle. 

`app.component.ts` in `ngOnInit()`
```typescript
import {MParticleCapacitor} from 'mparticle-capacitor';
...
    let mParticleKey = "YOUR KEY"
    MParticleCapacitor.mParticleConfig({
        isDevelopmentMode: true, 
        planID: "PLAN NAME", 
        planVer: 2,
        logLevel: "verbose", // || "warning" || "none"
    }).then((config:any) => {        
        if (!this.platform.is('hybrid')) {
            // add web kits here i.e.:
            // mParticleBraze.register(config);
        }
        MParticleCapacitor.mParticleInit({key: mParticleKey, mParticleConfig: config})
        .catch((e:any) => {}); // initialize mparticle web, catch when ios/android return unimplemented.  
    }).catch((e:any) => {});

    /* or */

    if (!this.platform.is('hybrid')) { initMP(); }

    async initMP() {
        let mParticleKey = "YOUR KEY"
        let mpConfig = await MParticleCapacitor.mParticleConfig({
            isDevelopmentMode: true, 
            planID: "PLAN NAME", 
            planVer: 2,
            logLevel: "verbose", // || "warning" || "none"
        });
        // add web kits here i.e.:
        // mParticleBraze.register(mpConfig);
        MParticleCapacitor.mParticleInit({key: mParticleKey, mParticleConfig: mpConfig});
    }
```

### Android

Initilize mParticle in the app directly instead of the plugin, Appboy/Braze needs the permissions mParticle will pass to it through this.
`MainActivity.java` in `onCreate()`
```java
import com.mparticle.MParticle;
import com.mparticle.MParticleOptions;
...
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        MParticleOptions options = MParticleOptions.builder(this)
        .credentials( "YOUR KEY HERE", "MATCHING SECRET" )
        .environment(MParticle.Environment.Development) // or MParticle.Environment.Production
        .dataplan("master_data_plan", 2)
        .logLevel(MParticle.LogLevel.DEBUG) // to see debug logging in Android Studio
        .androidIdEnabled(true) // required for SDK 5.35+
        .build();
        MParticle.start(options);
    }
}
```

can't find "com.mparticle...."? add `android:exported="true"` to `AndroidMnifest.xml` under `<activity>`>

### iOS

Initilize mParticle in the app directly instead of the plugin, Appboy/Braze needs the permissions mParticle will pass to it through this.
`AppDelegate.swift`

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let options = MParticleOptions(key: "YOUR KEY HERE", secret: "MATCHING SECRET")
    options.environment = MPEnvironment.development; // or MPEnvironment.production
    options.dataPlanId = "master_data_plan"
    options.logLevel = MPILogLevel.verbose // to see debug logging in XCode
    MParticle.sharedInstance().start(with: options)
    return true
}
```

## Adding Kits

All available kits can be found here: https://github.com/mparticle-integrations

MParticle provides a "black-box" solution to data sharing between other api. Kits do not need to be added to the plugin, they can be added directly to your app's `Podfile (iOS)` or `build.gradle (Android)` or into your `app.component.ts (web)`.

## Any Web Integration

Web kits are added before the web initialization in the component. If there is an error with the inport: 
`Error: export 'MParticleBraze' (imported as 'MParticleBraze') was not found...`
import using `require`:
```typescript
const mParticleBraze = require('@mparticle/web-braze-kit');
```

## Braze Integration

mParticle will handle the integration internally as long as things are hooked up in the dashboard.

There are some custom settings and inclusions that need to be included in your project for mParticle to route data to Braze properly.

### Android

Android will complain about not finding a package unless you include this repo in your `build.gradle`:

```gradle
repositories {
    maven { url "https://appboy.github.io/appboy-android-sdk/sdk" }
    ...
}
dependencies {
    implementation 'com.mparticle:android-appboy-kit:5+'
}
```
Full documentation here: https://github.com/mparticle-integrations/mparticle-android-integration-appboy

### iOS

Add the kit to your app's Podfile:
```Podfile
pod 'mParticle-Appboy', '~> 8'
```

### Enable Push Notifications

#### Android

Add Firebase to your ```build.gradle```
```gradle
compile 'com.google.firebase:firebase-core:<YOUR_PLAY_SERVICES_VERSION>'
compile 'com.google.firebase:firebase-messaging:<YOUR_PLAY_SERVICES_VERSION>'
```
Add mParticle's InstanceService to `AndroidManifest.xml`
```xml
<service android:name="com.mparticle.messaging.InstanceIdService" />

<receiver
    android:name="com.mparticle.MPReceiver"
    android:permission="com.google.android.c2dm.permission.SEND">
    <intent-filter>
        <action android:name="com.google.android.c2dm.intent.RECEIVE" />

        <!-- Use your package name as the category -->
        <category android:name="YOURPACKAGENAME" />
    </intent-filter>
</receiver>
<!-- This is the service that does the heavy lifting in parsing, showing, and tracking FCM/GCM notifications. -->
<service android:name="com.mparticle.MPService" />

```

Add this to your ```MainActivity.java``` after your mParticle init
```java 
MParticle.getInstance().Messaging().enablePushNotifications( "YOUR SENDER ID" );
```
Full mParticle Documentation Here: https://docs.mparticle.com/developers/sdk/android/push-notifications/

Add `BrazeFirebaseMessagingService` to your `AndroidManifest.xml`
```xml
<service android:name="com.braze.push.BrazeFirebaseMessagingService" android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

Create a `braze.xml` file in `android/app/src/main/res/values`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="com_braze_default_notification_accent_color">@android:color/black</color> <!--Sets Icon Background Default-->
  <drawable name="com_braze_push_small_notification_icon">@drawable/ic_star_face_larger_notification</drawable> <!--Sets Default Large Icon-->
  <drawable name="com_braze_push_large_notification_icon">@drawable/ic_star_vector</drawable> <!--Sets Default Small Icon-->
  <bool name="com_braze_handle_push_deep_links_automatically">true</bool> <!--Required to allow notification to open app-->
</resources>
```
Full Documentation Here: https://www.braze.com/docs/developer_guide/platform_integration_guides/android/push_notifications/android/integration/standard_integration/#custom-handling-for-push-receipts-opens-dismissals-and-key-value-pairs

#### iOS

mParticle will handle the integration internaly. There may be issues depending on other packages in your app. Full mParticle documentation here: https://docs.mparticle.com/developers/sdk/ios/push-notifications/

> iOS does not pass push tokens automatically, for your hybrid app I recommend using: https://capacitorjs.com/docs/apis/push-notifications to request and enable push notifictaions for your users

##### Device Push Tokens Aren't Getting to Braze (swizzling)

Look for functions that override or proxy the AppDelegate functions specifically `didRegisterForRemoteNotificationsWithDeviceToken`. Firebase Gets in the way of Braze And mParticle interactions 
> ref: https://firebase.google.com/docs/cloud-messaging/ios/client
> The FCM SDK performs method swizzling in two key areas: mapping your APNs token to the FCM registration token and capturing analytics data during downstream message callback handling. Developers who prefer not to use swizzling can disable it by adding the flag FirebaseAppDelegateProxyEnabled in the app’s Info.plist file and setting it to NO (boolean value). Relevant areas of the guides provide code examples, both with and without method swizzling enabled.

solution is in your ```Info.plist```: 
    ![info.plist firebase](https://i.stack.imgur.com/XnMm0.png)
> (via. https://firebase.google.com/docs/cloud-messaging/ios/client)

## AppsFlyer

AppsFlyer works as expected out of the box. Most of the settings will be handled between the dashboards.

### Android

Add the AppsFlyer kit to your app's `build.gradle`:
```gradle
dependencies {
    implementation 'com.mparticle:android-appsflyer-kit:5+'
}
```
Full documentation here: https://github.com/mparticle-integrations/mparticle-android-integration-appsflyer

### iOS

Add the kit to your app's Podfile:
```Podfile
pod 'mParticle-AppsFlyer', '~> 8'
```

Full documentation here: https://github.com/mparticle-integrations/mparticle-apple-integration-appsflyer

### AppsFlyer Capacitor Plugin (Deeplining)

The AppsFlyer capacitor plugin can work in parallell with the kit to process the deeplinks

```bash
npm install appsflyer-capacitor-plugin  
npx cap sync
```

Note that we add the listener before the init.

```typescript
AppsFlyer.addListener(AFConstants.UDL_CALLBACK, (res) => {
  console.log('URL APPSFLYER UDL_CALLBACK ~~>' + JSON.stringify(res));
  if (res.status === 'FOUND') {
    // do the deeplink process
  } else if (res.status === 'ERROR') {
    console.log('deep link error');
  } else {
    console.log('deep link not found');
  }
}); 

AppsFlyer.initSDK({
    appID: '{APPID}',  // replace with your app ID.
      devKey: '{DEVKEY}',   // replace with your dev key.
      isDebug: true,
      waitForATTUserAuthorization: 10, // for iOS 14 and higher
      registerOnDeepLink: true,
      registerConversionListener: true,
}).then().catch(e =>console.log("AppsFlyer Error Catch",e));    
```

It is also recommended to encapulate the above code in `if (platform.is('hybrid')) {` or something similar as this listener will throw an 'unimplemented' error when in a web environment. AppsFlyer documentation also recommends to start in `this.platform.ready().then(() => {`.

Full documentation here: https://github.com/AppsFlyerSDK/appsflyer-capacitor-plugin



## API

<docgen-index>

* [`echo(...)`](#echo)
* [`mParticleConfig(...)`](#mparticleconfig)
* [`mParticleInit(...)`](#mparticleinit)
* [`loginMParticleUser(...)`](#loginmparticleuser)
* [`logoutMParticleUser(...)`](#logoutmparticleuser)
* [`getAllUserAttributes(...)`](#getalluserattributes)
* [`logMParticleEvent(...)`](#logmparticleevent)
* [`logMParticlePageView(...)`](#logmparticlepageview)
* [`logMParticleScreenView(...)`](#logmparticlescreenview)
* [`setUserAttribute(...)`](#setuserattribute)
* [`setUserAttributeList(...)`](#setuserattributelist)
* [`removeUserAttribute(...)`](#removeuserattribute)
* [`updateMParticleCart(...)`](#updatemparticlecart)
* [`addMParticleProduct(...)`](#addmparticleproduct)
* [`removeMParticleProduct(...)`](#removemparticleproduct)
* [`submitPurchaseEvent(...)`](#submitpurchaseevent)
* [`registerMParticleUser(...)`](#registermparticleuser)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### mParticleConfig(...)

```typescript
mParticleConfig(call: MParticleConfigArguments) => Promise<MPConfigType>
```

| Param      | Type                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| **`call`** | <code><a href="#mparticleconfigarguments">MParticleConfigArguments</a></code> |

**Returns:** <code>Promise&lt;<a href="#mpconfigtype">MPConfigType</a>&gt;</code>

--------------------


### mParticleInit(...)

```typescript
mParticleInit(call: { key: string; mParticleConfig: any; }) => Promise<IdentityResult>
```

| Param      | Type                                                |
| ---------- | --------------------------------------------------- |
| **`call`** | <code>{ key: string; mParticleConfig: any; }</code> |

**Returns:** <code>Promise&lt;<a href="#identityresult">IdentityResult</a>&gt;</code>

--------------------


### loginMParticleUser(...)

```typescript
loginMParticleUser(call: { email: string; customerId?: string; }) => Promise<{ value: string; }>
```

| Param      | Type                                                 |
| ---------- | ---------------------------------------------------- |
| **`call`** | <code>{ email: string; customerId?: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### logoutMParticleUser(...)

```typescript
logoutMParticleUser(call?: any) => Promise<IdentityResult>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;<a href="#identityresult">IdentityResult</a>&gt;</code>

--------------------


### getAllUserAttributes(...)

```typescript
getAllUserAttributes(call?: any) => AllUserAttributes
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code><a href="#alluserattributes">AllUserAttributes</a></code>

--------------------


### logMParticleEvent(...)

```typescript
logMParticleEvent(call: { eventName: string; eventType: any; eventProperties: any; }) => void
```

| Param      | Type                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| **`call`** | <code>{ eventName: string; eventType: any; eventProperties: any; }</code> |

--------------------


### logMParticlePageView(...)

```typescript
logMParticlePageView(call: { pageName: string; pageLink: any; overrides?: any; }) => void
```

| Param      | Type                                                               |
| ---------- | ------------------------------------------------------------------ |
| **`call`** | <code>{ pageName: string; pageLink: any; overrides?: any; }</code> |

--------------------


### logMParticleScreenView(...)

```typescript
logMParticleScreenView(call: { eventName: string; eventType: any; eventProperties?: any; }) => void
```

| Param      | Type                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| **`call`** | <code>{ eventName: string; eventType: any; eventProperties?: any; }</code> |

--------------------


### setUserAttribute(...)

```typescript
setUserAttribute(call: { attributeName: string; attributeValue: string; }) => void
```

| Param      | Type                                                            |
| ---------- | --------------------------------------------------------------- |
| **`call`** | <code>{ attributeName: string; attributeValue: string; }</code> |

--------------------


### setUserAttributeList(...)

```typescript
setUserAttributeList(call: { attributeName: string; attributeValues: any; }) => void
```

| Param      | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`call`** | <code>{ attributeName: string; attributeValues: any; }</code> |

--------------------


### removeUserAttribute(...)

```typescript
removeUserAttribute(call: { attributeName: string; }) => void
```

| Param      | Type                                    |
| ---------- | --------------------------------------- |
| **`call`** | <code>{ attributeName: string; }</code> |

--------------------


### updateMParticleCart(...)

```typescript
updateMParticleCart(call: { productData: any; customAttributes: any; eventType: any; }) => void
```

| Param      | Type                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; eventType: any; }</code> |

--------------------


### addMParticleProduct(...)

```typescript
addMParticleProduct(call: { productData: any; customAttributes: any; }) => void
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; }</code> |

--------------------


### removeMParticleProduct(...)

```typescript
removeMParticleProduct(call: { productData: any; customAttributes: any; }) => void
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; }</code> |

--------------------


### submitPurchaseEvent(...)

```typescript
submitPurchaseEvent(call: { productData: any; customAttributes: any; transactionAttributes: any; }) => void
```

| Param      | Type                                                                                  |
| ---------- | ------------------------------------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; transactionAttributes: any; }</code> |

--------------------


### registerMParticleUser(...)

```typescript
registerMParticleUser(call: { email: string; customerId?: string; userAttributes: any; }) => Promise<any>
```

| Param      | Type                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| **`call`** | <code>{ email: string; customerId?: string; userAttributes: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### Interfaces


#### IdentityResult

| Prop           | Type                                                              |
| -------------- | ----------------------------------------------------------------- |
| **`httpCode`** | <code>any</code>                                                  |
| **`body`**     | <code><a href="#identityresultbody">IdentityResultBody</a></code> |

| Method              | Signature                         |
| ------------------- | --------------------------------- |
| **getPreviousUser** | () =&gt; <a href="#user">User</a> |
| **getUser**         | () =&gt; <a href="#user">User</a> |


#### User

| Prop                          | Type                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **`getUserIdentities`**       | <code>() =&gt; <a href="#useridentities">UserIdentities</a></code>                                           |
| **`getMPID`**                 | <code>() =&gt; string</code>                                                                                 |
| **`setUserTag`**              | <code>(tag: string) =&gt; void</code>                                                                        |
| **`removeUserTag`**           | <code>(tag: string) =&gt; void</code>                                                                        |
| **`setUserAttribute`**        | <code>(key: string, value: string) =&gt; void</code>                                                         |
| **`setUserAttributes`**       | <code>(attributeObject: <a href="#record">Record</a>&lt;string, unknown&gt;) =&gt; void</code>               |
| **`removeUserAttribute`**     | <code>(key: string) =&gt; void</code>                                                                        |
| **`setUserAttributeList`**    | <code>(key: string, value: UserAttributesValue[]) =&gt; void</code>                                          |
| **`removeAllUserAttributes`** | <code>() =&gt; void</code>                                                                                   |
| **`getUserAttributesLists`**  | <code>() =&gt; <a href="#record">Record</a>&lt;string, UserAttributesValue[]&gt;</code>                      |
| **`getAllUserAttributes`**    | <code>() =&gt; <a href="#alluserattributes">AllUserAttributes</a></code>                                     |
| **`getCart`**                 | <code>() =&gt; <a href="#cart">Cart</a></code>                                                               |
| **`getConsentState`**         | <code>() =&gt; <a href="#consentstate">ConsentState</a></code>                                               |
| **`setConsentState`**         | <code>(<a href="#consentstate">ConsentState</a>: <a href="#consentstate">ConsentState</a>) =&gt; void</code> |
| **`isLoggedIn`**              | <code>() =&gt; boolean</code>                                                                                |
| **`getLastSeenTime`**         | <code>() =&gt; number</code>                                                                                 |
| **`getFirstSeenTime`**        | <code>() =&gt; number</code>                                                                                 |


#### UserIdentities

| Prop                           | Type                |
| ------------------------------ | ------------------- |
| **`customerid`**               | <code>string</code> |
| **`email`**                    | <code>string</code> |
| **`other`**                    | <code>string</code> |
| **`other2`**                   | <code>string</code> |
| **`other3`**                   | <code>string</code> |
| **`other4`**                   | <code>string</code> |
| **`other5`**                   | <code>string</code> |
| **`other6`**                   | <code>string</code> |
| **`other7`**                   | <code>string</code> |
| **`other8`**                   | <code>string</code> |
| **`other9`**                   | <code>string</code> |
| **`other10`**                  | <code>string</code> |
| **`mobile_number`**            | <code>string</code> |
| **`phone_number_2`**           | <code>string</code> |
| **`phone_number_3`**           | <code>string</code> |
| **`facebook`**                 | <code>string</code> |
| **`facebookcustomaudienceid`** | <code>string</code> |
| **`google`**                   | <code>string</code> |
| **`twitter`**                  | <code>string</code> |
| **`microsoft`**                | <code>string</code> |
| **`yahoo`**                    | <code>string</code> |


#### Cart

| Prop         | Type                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| **`add`**    | <code>(product: <a href="#product">Product</a>, logEventBoolean?: boolean) =&gt; void</code> |
| **`remove`** | <code>(product: <a href="#product">Product</a>, logEventBoolean?: boolean) =&gt; void</code> |
| **`clear`**  | <code>() =&gt; void</code>                                                                   |


#### Product

| Prop             | Type                                                             |
| ---------------- | ---------------------------------------------------------------- |
| **`name`**       | <code>string</code>                                              |
| **`sku`**        | <code>string</code>                                              |
| **`price`**      | <code>number</code>                                              |
| **`quantity`**   | <code>number</code>                                              |
| **`variant`**    | <code>string</code>                                              |
| **`category`**   | <code>string</code>                                              |
| **`brand`**      | <code>string</code>                                              |
| **`position`**   | <code>number</code>                                              |
| **`coupon`**     | <code>string</code>                                              |
| **`attributes`** | <code><a href="#record">Record</a>&lt;string, unknown&gt;</code> |


#### ConsentState

| Prop                         | Type                                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`setGDPRConsentState`**    | <code>(gdprConsentState: <a href="#gdprconsentstate">GDPRConsentState</a>) =&gt; <a href="#consentstate">ConsentState</a></code>                   |
| **`setCCPAConsentState`**    | <code>(ccpaConsentState: <a href="#privacyconsentstate">PrivacyConsentState</a>) =&gt; <a href="#consentstate">ConsentState</a></code>             |
| **`addGDPRConsentState`**    | <code>(purpose: string, gdprConsent: <a href="#privacyconsentstate">PrivacyConsentState</a>) =&gt; <a href="#consentstate">ConsentState</a></code> |
| **`getGDPRConsentState`**    | <code>() =&gt; <a href="#gdprconsentstate">GDPRConsentState</a></code>                                                                             |
| **`getCCPAConsentState`**    | <code>() =&gt; <a href="#privacyconsentstate">PrivacyConsentState</a></code>                                                                       |
| **`removeGDPRConsentState`** | <code>(purpose: string) =&gt; <a href="#consentstate">ConsentState</a></code>                                                                      |
| **`removeCCPAConsentState`** | <code>() =&gt; <a href="#consentstate">ConsentState</a></code>                                                                                     |


#### GDPRConsentState


#### PrivacyConsentState

| Prop                  | Type                 |
| --------------------- | -------------------- |
| **`Consented`**       | <code>boolean</code> |
| **`Timestamp`**       | <code>number</code>  |
| **`ConsentDocument`** | <code>string</code>  |
| **`Location`**        | <code>string</code>  |
| **`HardwareId`**      | <code>string</code>  |


#### IdentityResultBody

| Prop                     | Type                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| **`context`**            | <code>string \| null</code>                                      |
| **`is_ephemeral`**       | <code>boolean</code>                                             |
| **`is_logged_in`**       | <code>boolean</code>                                             |
| **`matched_identities`** | <code><a href="#record">Record</a>&lt;string, unknown&gt;</code> |


#### MParticleConfigArguments

| Prop                      | Type                                                                        |
| ------------------------- | --------------------------------------------------------------------------- |
| **`isDevelopmentMode`**   | <code>boolean</code>                                                        |
| **`planID`**              | <code>string</code>                                                         |
| **`planVer`**             | <code>number</code>                                                         |
| **`planVersionRequired`** | <code>boolean</code>                                                        |
| **`logLevel`**            | <code>string</code>                                                         |
| **`identifyRequest`**     | <code>any</code>                                                            |
| **`identityCallback`**    | <code>((i: <a href="#identityresult">IdentityResult</a>) =&gt; void)</code> |


### Type Aliases


#### MPConfigType

<code>{ isDevelopmentMode?: boolean, dataPlan?: { planId?: string, planVersion?: number }, identifyRequest?: any, logLevel?: string, identityCallback?: (i: <a href="#identityresult">IdentityResult</a>) =&gt; void, }</code>


#### UserIdentities

<code>{ customerid?: string; email?: string; other?: string; other2?: string; other3?: string; other4?: string; other5?: string; other6?: string; other7?: string; other8?: string; other9?: string; other10?: string; mobile_number?: string; phone_number_2?: string; phone_number_3?: string; facebook?: string; facebookcustomaudienceid?: string; google?: string; twitter?: string; microsoft?: string; yahoo?: string; }</code>


#### MPID

<code>string</code>


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>


#### UserAttributesValue

<code>string | number | boolean | null</code>


#### AllUserAttributes

<code><a href="#record">Record</a>&lt; string, <a href="#userattributesvalue">UserAttributesValue</a> | UserAttributesValue[] &gt;</code>


#### Product

<code>{ name: string; sku: string; price: number; quantity?: number; variant?: string; category?: string; brand?: string; position?: number; coupon?: string; attributes?: <a href="#record">Record</a>&lt;string, unknown&gt;; }</code>


#### Cart

<code>{ /** * * @deprecated <a href="#cart">Cart</a> persistence in mParticle has been deprecated. Please use mParticle.eCommerce.logProductAction(mParticle.ProductActionType.AddToCart, [products]) */ add: (product: <a href="#product">Product</a>, logEventBoolean?: boolean) =&gt; void; /** * * @deprecated <a href="#cart">Cart</a> persistence in mParticle has been deprecated. Please use mParticle.eCommerce.logProductAction(mParticle.ProductActionType.RemoveFromCart, [products]) */ remove: (product: <a href="#product">Product</a>, logEventBoolean?: boolean) =&gt; void; /** * * @deprecated <a href="#cart">Cart</a> persistence in mParticle has been deprecated. */ clear: () =&gt; void; }</code>


#### GDPRConsentState

<code>{ [key: string]: <a href="#privacyconsentstate">PrivacyConsentState</a>; }</code>


#### PrivacyConsentState

<code>{ Consented: boolean; Timestamp: number; ConsentDocument: string; Location: string; HardwareId: string; }</code>


#### ConsentState

<code>{ setGDPRConsentState: (gdprConsentState: <a href="#gdprconsentstate">GDPRConsentState</a>) =&gt; <a href="#consentstate">ConsentState</a>; setCCPAConsentState: (ccpaConsentState: <a href="#ccpaconsentstate">CCPAConsentState</a>) =&gt; <a href="#consentstate">ConsentState</a>; addGDPRConsentState: ( purpose: string, gdprConsent: <a href="#privacyconsentstate">PrivacyConsentState</a>, ) =&gt; <a href="#consentstate">ConsentState</a>; getGDPRConsentState: () =&gt; <a href="#gdprconsentstate">GDPRConsentState</a>; getCCPAConsentState: () =&gt; <a href="#ccpaconsentstate">CCPAConsentState</a>; removeGDPRConsentState: (purpose: string) =&gt; <a href="#consentstate">ConsentState</a>; removeCCPAConsentState: () =&gt; <a href="#consentstate">ConsentState</a>; }</code>


#### CCPAConsentState

<code><a href="#privacyconsentstate">PrivacyConsentState</a></code>


#### User

<code>{ getUserIdentities: () =&gt; <a href="#useridentities">UserIdentities</a>; getMPID: () =&gt; <a href="#mpid">MPID</a>; setUserTag: (tag: string) =&gt; void; removeUserTag: (tag: string) =&gt; void; setUserAttribute: (key: string, value: string) =&gt; void; setUserAttributes: (attributeObject: <a href="#record">Record</a>&lt;string, unknown&gt;) =&gt; void; removeUserAttribute: (key: string) =&gt; void; setUserAttributeList: (key: string, value: UserAttributesValue[]) =&gt; void; removeAllUserAttributes: () =&gt; void; getUserAttributesLists: () =&gt; <a href="#record">Record</a>&lt;string, UserAttributesValue[]&gt;; getAllUserAttributes: () =&gt; <a href="#alluserattributes">AllUserAttributes</a>; /** * * @deprecated <a href="#cart">Cart</a> persistence in mParticle has been deprecated */ getCart: () =&gt; <a href="#cart">Cart</a>; getConsentState: () =&gt; <a href="#consentstate">ConsentState</a>; setConsentState: (<a href="#consentstate">ConsentState</a>: <a href="#consentstate">ConsentState</a>) =&gt; void; isLoggedIn: () =&gt; boolean; getLastSeenTime: () =&gt; number; getFirstSeenTime: () =&gt; number; }</code>


#### IdentityResult

<code>{ httpCode: any; getPreviousUser(): <a href="#user">User</a>; getUser(): <a href="#user">User</a>; body: <a href="#identityresultbody">IdentityResultBody</a>; }</code>

</docgen-api>
