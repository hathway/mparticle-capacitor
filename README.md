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
* [`setMParticleCapacitorConfiguration(...)`](#setmparticlecapacitorconfiguration)
* [`mParticleConfig(...)`](#mparticleconfig)
* [`mParticleInit(...)`](#mparticleinit)
* [`loginMParticleUser(...)`](#loginmparticleuser)
* [`logoutMParticleUser(...)`](#logoutmparticleuser)
* [`getAllUserAttributes()`](#getalluserattributes)
* [`logMParticleEvent(...)`](#logmparticleevent)
* [`logMParticlePageView(...)`](#logmparticlepageview)
* [`setUserAttribute(...)`](#setuserattribute)
* [`setUserAttributeList(...)`](#setuserattributelist)
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


### setMParticleCapacitorConfiguration(...)

```typescript
setMParticleCapacitorConfiguration(config: MParticleCapacitorWebConfigurationInterface) => void
```

| Param        | Type                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| **`config`** | <code><a href="#mparticlecapacitorwebconfigurationinterface">MParticleCapacitorWebConfigurationInterface</a></code> |

--------------------


### mParticleConfig(...)

```typescript
mParticleConfig(call: { isDevelopmentMode?: boolean; planID?: string; planVer?: number; logLevel?: string; identifyRequest?: any; identityCallback?: Function; }) => Promise<MPConfigType>
```

| Param      | Type                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`call`** | <code>{ isDevelopmentMode?: boolean; planID?: string; planVer?: number; logLevel?: string; identifyRequest?: any; identityCallback?: <a href="#function">Function</a>; }</code> |

**Returns:** <code>Promise&lt;<a href="#mpconfigtype">MPConfigType</a>&gt;</code>

--------------------


### mParticleInit(...)

```typescript
mParticleInit(call: { key: string; mParticleConfig: any; }) => Promise<any>
```

| Param      | Type                                                |
| ---------- | --------------------------------------------------- |
| **`call`** | <code>{ key: string; mParticleConfig: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### loginMParticleUser(...)

```typescript
loginMParticleUser(call: { email: string; customerId: string; }) => Promise<any>
```

| Param      | Type                                                |
| ---------- | --------------------------------------------------- |
| **`call`** | <code>{ email: string; customerId: string; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### logoutMParticleUser(...)

```typescript
logoutMParticleUser(call?: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### getAllUserAttributes()

```typescript
getAllUserAttributes() => Promise<any>
```

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### logMParticleEvent(...)

```typescript
logMParticleEvent(call: { eventName: string; eventType: any; eventProperties: any; }) => Promise<any>
```

| Param      | Type                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| **`call`** | <code>{ eventName: string; eventType: any; eventProperties: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### logMParticlePageView(...)

```typescript
logMParticlePageView(call: { pageName: string; pageLink: any; }) => Promise<any>
```

| Param      | Type                                              |
| ---------- | ------------------------------------------------- |
| **`call`** | <code>{ pageName: string; pageLink: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### setUserAttribute(...)

```typescript
setUserAttribute(call: { attributeName: string; attributeValue: string; }) => Promise<any>
```

| Param      | Type                                                            |
| ---------- | --------------------------------------------------------------- |
| **`call`** | <code>{ attributeName: string; attributeValue: string; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### setUserAttributeList(...)

```typescript
setUserAttributeList(call: { attributeName: string; attributeValues: any; }) => Promise<any>
```

| Param      | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`call`** | <code>{ attributeName: string; attributeValues: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### updateMParticleCart(...)

```typescript
updateMParticleCart(call: { productData: any; customAttributes: any; eventType: any; }) => Promise<any>
```

| Param      | Type                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; eventType: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### addMParticleProduct(...)

```typescript
addMParticleProduct(call: { productData: any; customAttributes: any; }) => Promise<any>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### removeMParticleProduct(...)

```typescript
removeMParticleProduct(call: { productData: any; customAttributes: any; }) => Promise<any>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### submitPurchaseEvent(...)

```typescript
submitPurchaseEvent(call: { productData: any; customAttributes: any; transactionAttributes: any; }) => Promise<any>
```

| Param      | Type                                                                                  |
| ---------- | ------------------------------------------------------------------------------------- |
| **`call`** | <code>{ productData: any; customAttributes: any; transactionAttributes: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### registerMParticleUser(...)

```typescript
registerMParticleUser(call: { email: string; customerId: string; userAttributes: any; }) => Promise<any>
```

| Param      | Type                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| **`call`** | <code>{ email: string; customerId: string; userAttributes: any; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### Interfaces


#### MParticleCapacitorWebConfigurationInterface

| Prop                               | Type                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`planVersion`**                  | <code>number</code>                                                                                                 |
| **`eventAttributesMap`**           | <code>{ pageView: { url: string; }; }</code>                                                                        |
| **`identityRequestAttributesMap`** | <code>{ email: { required: boolean; }; customerId: { required: boolean; }; mobile: { required: boolean; }; }</code> |


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


#### Function

Creates a new function.

| Prop            | Type                                          |
| --------------- | --------------------------------------------- |
| **`prototype`** | <code>any</code>                              |
| **`length`**    | <code>number</code>                           |
| **`arguments`** | <code>any</code>                              |
| **`caller`**    | <code><a href="#function">Function</a></code> |

| Method       | Signature                                                                            | Description                                                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **apply**    | (this: <a href="#function">Function</a>, thisArg: any, argArray?: any) =&gt; any     | Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.                                                                     |
| **call**     | (this: <a href="#function">Function</a>, thisArg: any, ...argArray: any[]) =&gt; any | Calls a method of an object, substituting another object for the current object.                                                                                                                                         |
| **bind**     | (this: <a href="#function">Function</a>, thisArg: any, ...argArray: any[]) =&gt; any | For a given function, creates a bound function that has the same body as the original function. The this object of the bound function is associated with the specified object, and has the specified initial parameters. |
| **toString** | () =&gt; string                                                                      | Returns a string representation of a function.                                                                                                                                                                           |


#### FunctionDeclaration

| Prop       | Type                                                                  | Description                                                                                 |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **`type`** | <code>'<a href="#functiondeclaration">FunctionDeclaration</a>'</code> |                                                                                             |
| **`id`**   | <code><a href="#identifier">Identifier</a> \| null</code>             | It is null when a function declaration is a part of the `export default function` statement |
| **`body`** | <code><a href="#blockstatement">BlockStatement</a></code>             |                                                                                             |


#### Identifier

| Prop       | Type                                                |
| ---------- | --------------------------------------------------- |
| **`type`** | <code>'<a href="#identifier">Identifier</a>'</code> |
| **`name`** | <code>string</code>                                 |


#### BlockStatement

| Prop                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| **`type`**          | <code>'<a href="#blockstatement">BlockStatement</a>'</code>                       |
| **`body`**          | <code><a href="#array">Array</a>&lt;<a href="#statement">Statement</a>&gt;</code> |
| **`innerComments`** | <code>Comment[]</code>                                                            |


#### Array

| Prop         | Type                | Description                                                                                            |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------ |
| **`length`** | <code>number</code> | Gets or sets the length of the array. This is a number one higher than the highest index in the array. |

| Method             | Signature                                                                                                                     | Description                                                                                                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **toString**       | () =&gt; string                                                                                                               | Returns a string representation of an array.                                                                                                                                                                                                |
| **toLocaleString** | () =&gt; string                                                                                                               | Returns a string representation of an array. The elements are converted to string using their toLocalString methods.                                                                                                                        |
| **pop**            | () =&gt; T \| undefined                                                                                                       | Removes the last element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.                                                                                                          |
| **push**           | (...items: T[]) =&gt; number                                                                                                  | Appends new elements to the end of an array, and returns the new length of the array.                                                                                                                                                       |
| **concat**         | (...items: <a href="#concatarray">ConcatArray</a>&lt;T&gt;[]) =&gt; T[]                                                       | Combines two or more arrays. This method returns a new array without modifying any existing arrays.                                                                                                                                         |
| **concat**         | (...items: (T \| <a href="#concatarray">ConcatArray</a>&lt;T&gt;)[]) =&gt; T[]                                                | Combines two or more arrays. This method returns a new array without modifying any existing arrays.                                                                                                                                         |
| **join**           | (separator?: string \| undefined) =&gt; string                                                                                | Adds all the elements of an array into a string, separated by the specified separator string.                                                                                                                                               |
| **reverse**        | () =&gt; T[]                                                                                                                  | Reverses the elements in an array in place. This method mutates the array and returns a reference to the same array.                                                                                                                        |
| **shift**          | () =&gt; T \| undefined                                                                                                       | Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.                                                                                                         |
| **slice**          | (start?: number \| undefined, end?: number \| undefined) =&gt; T[]                                                            | Returns a copy of a section of an array. For both start and end, a negative index can be used to indicate an offset from the end of the array. For example, -2 refers to the second to last element of the array.                           |
| **sort**           | (compareFn?: ((a: T, b: T) =&gt; number) \| undefined) =&gt; this                                                             | Sorts an array in place. This method mutates the array and returns a reference to the same array.                                                                                                                                           |
| **splice**         | (start: number, deleteCount?: number \| undefined) =&gt; T[]                                                                  | Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.                                                                                                                      |
| **splice**         | (start: number, deleteCount: number, ...items: T[]) =&gt; T[]                                                                 | Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.                                                                                                                      |
| **unshift**        | (...items: T[]) =&gt; number                                                                                                  | Inserts new elements at the start of an array, and returns the new length of the array.                                                                                                                                                     |
| **indexOf**        | (searchElement: T, fromIndex?: number \| undefined) =&gt; number                                                              | Returns the index of the first occurrence of a value in an array, or -1 if it is not present.                                                                                                                                               |
| **lastIndexOf**    | (searchElement: T, fromIndex?: number \| undefined) =&gt; number                                                              | Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.                                                                                                                                      |
| **every**          | &lt;S extends T&gt;(predicate: (value: T, index: number, array: T[]) =&gt; value is S, thisArg?: any) =&gt; this is S[]       | Determines whether all the members of an array satisfy the specified test.                                                                                                                                                                  |
| **every**          | (predicate: (value: T, index: number, array: T[]) =&gt; unknown, thisArg?: any) =&gt; boolean                                 | Determines whether all the members of an array satisfy the specified test.                                                                                                                                                                  |
| **some**           | (predicate: (value: T, index: number, array: T[]) =&gt; unknown, thisArg?: any) =&gt; boolean                                 | Determines whether the specified callback function returns true for any element of an array.                                                                                                                                                |
| **forEach**        | (callbackfn: (value: T, index: number, array: T[]) =&gt; void, thisArg?: any) =&gt; void                                      | Performs the specified action for each element in an array.                                                                                                                                                                                 |
| **map**            | &lt;U&gt;(callbackfn: (value: T, index: number, array: T[]) =&gt; U, thisArg?: any) =&gt; U[]                                 | Calls a defined callback function on each element of an array, and returns an array that contains the results.                                                                                                                              |
| **filter**         | &lt;S extends T&gt;(predicate: (value: T, index: number, array: T[]) =&gt; value is S, thisArg?: any) =&gt; S[]               | Returns the elements of an array that meet the condition specified in a callback function.                                                                                                                                                  |
| **filter**         | (predicate: (value: T, index: number, array: T[]) =&gt; unknown, thisArg?: any) =&gt; T[]                                     | Returns the elements of an array that meet the condition specified in a callback function.                                                                                                                                                  |
| **reduce**         | (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) =&gt; T) =&gt; T                           | Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.                      |
| **reduce**         | (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) =&gt; T, initialValue: T) =&gt; T          |                                                                                                                                                                                                                                             |
| **reduce**         | &lt;U&gt;(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) =&gt; U, initialValue: U) =&gt; U | Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.                      |
| **reduceRight**    | (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) =&gt; T) =&gt; T                           | Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. |
| **reduceRight**    | (callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) =&gt; T, initialValue: T) =&gt; T          |                                                                                                                                                                                                                                             |
| **reduceRight**    | &lt;U&gt;(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) =&gt; U, initialValue: U) =&gt; U | Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. |


#### ConcatArray

| Prop         | Type                |
| ------------ | ------------------- |
| **`length`** | <code>number</code> |

| Method    | Signature                                                          |
| --------- | ------------------------------------------------------------------ |
| **join**  | (separator?: string \| undefined) =&gt; string                     |
| **slice** | (start?: number \| undefined, end?: number \| undefined) =&gt; T[] |


#### ExpressionStatement

| Prop             | Type                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#expressionstatement">ExpressionStatement</a>'</code> |
| **`expression`** | <code><a href="#expression">Expression</a></code>                     |


#### ThisExpression

| Prop       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| **`type`** | <code>'<a href="#thisexpression">ThisExpression</a>'</code> |


#### ArrayExpression

| Prop           | Type                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#arrayexpression">ArrayExpression</a>'</code>                                                                             |
| **`elements`** | <code><a href="#array">Array</a>&lt;<a href="#expression">Expression</a> \| <a href="#spreadelement">SpreadElement</a> \| null&gt;</code> |


#### SpreadElement

| Prop           | Type                                                      |
| -------------- | --------------------------------------------------------- |
| **`type`**     | <code>'<a href="#spreadelement">SpreadElement</a>'</code> |
| **`argument`** | <code><a href="#expression">Expression</a></code>         |


#### ObjectExpression

| Prop             | Type                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#objectexpression">ObjectExpression</a>'</code>                                                               |
| **`properties`** | <code><a href="#array">Array</a>&lt;<a href="#property">Property</a> \| <a href="#spreadelement">SpreadElement</a>&gt;</code> |


#### Property

| Prop            | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`type`**      | <code>'<a href="#property">Property</a>'</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **`key`**       | <code><a href="#expression">Expression</a> \| <a href="#privateidentifier">PrivateIdentifier</a></code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **`value`**     | <code><a href="#simpleliteral">SimpleLiteral</a> \| <a href="#regexpliteral">RegExpLiteral</a> \| <a href="#bigintliteral">BigIntLiteral</a> \| <a href="#identifier">Identifier</a> \| <a href="#objectpattern">ObjectPattern</a> \| <a href="#arraypattern">ArrayPattern</a> \| <a href="#restelement">RestElement</a> \| <a href="#assignmentpattern">AssignmentPattern</a> \| <a href="#memberexpression">MemberExpression</a> \| <a href="#thisexpression">ThisExpression</a> \| <a href="#arrayexpression">ArrayExpression</a> \| <a href="#objectexpression">ObjectExpression</a> \| <a href="#functionexpression">FunctionExpression</a> \| <a href="#arrowfunctionexpression">ArrowFunctionExpression</a> \| <a href="#yieldexpression">YieldExpression</a> \| <a href="#unaryexpression">UnaryExpression</a> \| <a href="#updateexpression">UpdateExpression</a> \| <a href="#binaryexpression">BinaryExpression</a> \| <a href="#assignmentexpression">AssignmentExpression</a> \| <a href="#logicalexpression">LogicalExpression</a> \| <a href="#conditionalexpression">ConditionalExpression</a> \| <a href="#simplecallexpression">SimpleCallExpression</a> \| <a href="#newexpression">NewExpression</a> \| <a href="#sequenceexpression">SequenceExpression</a> \| <a href="#templateliteral">TemplateLiteral</a> \| <a href="#taggedtemplateexpression">TaggedTemplateExpression</a> \| <a href="#classexpression">ClassExpression</a> \| <a href="#metaproperty">MetaProperty</a> \| <a href="#awaitexpression">AwaitExpression</a> \| <a href="#importexpression">ImportExpression</a> \| <a href="#chainexpression">ChainExpression</a></code> |
| **`kind`**      | <code>'init' \| 'get' \| 'set'</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **`method`**    | <code>boolean</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **`shorthand`** | <code>boolean</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **`computed`**  | <code>boolean</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |


#### PrivateIdentifier

| Prop       | Type                                                              |
| ---------- | ----------------------------------------------------------------- |
| **`type`** | <code>'<a href="#privateidentifier">PrivateIdentifier</a>'</code> |
| **`name`** | <code>string</code>                                               |


#### ObjectPattern

| Prop             | Type                                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#objectpattern">ObjectPattern</a>'</code>                                                                                     |
| **`properties`** | <code><a href="#array">Array</a>&lt;<a href="#assignmentproperty">AssignmentProperty</a> \| <a href="#restelement">RestElement</a>&gt;</code> |


#### AssignmentProperty

| Prop         | Type                                        |
| ------------ | ------------------------------------------- |
| **`value`**  | <code><a href="#pattern">Pattern</a></code> |
| **`kind`**   | <code>'init'</code>                         |
| **`method`** | <code>boolean</code>                        |


#### RestElement

| Prop           | Type                                                  |
| -------------- | ----------------------------------------------------- |
| **`type`**     | <code>'<a href="#restelement">RestElement</a>'</code> |
| **`argument`** | <code><a href="#pattern">Pattern</a></code>           |


#### ArrayPattern

| Prop           | Type                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#arraypattern">ArrayPattern</a>'</code>                               |
| **`elements`** | <code><a href="#array">Array</a>&lt;<a href="#pattern">Pattern</a> \| null&gt;</code> |


#### AssignmentPattern

| Prop        | Type                                                              |
| ----------- | ----------------------------------------------------------------- |
| **`type`**  | <code>'<a href="#assignmentpattern">AssignmentPattern</a>'</code> |
| **`left`**  | <code><a href="#pattern">Pattern</a></code>                       |
| **`right`** | <code><a href="#expression">Expression</a></code>                 |


#### MemberExpression

| Prop           | Type                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#memberexpression">MemberExpression</a>'</code>                                         |
| **`object`**   | <code><a href="#expression">Expression</a> \| <a href="#super">Super</a></code>                         |
| **`property`** | <code><a href="#expression">Expression</a> \| <a href="#privateidentifier">PrivateIdentifier</a></code> |
| **`computed`** | <code>boolean</code>                                                                                    |
| **`optional`** | <code>boolean</code>                                                                                    |


#### Super

| Prop       | Type                                      |
| ---------- | ----------------------------------------- |
| **`type`** | <code>'<a href="#super">Super</a>'</code> |


#### FunctionExpression

| Prop       | Type                                                                |
| ---------- | ------------------------------------------------------------------- |
| **`id`**   | <code><a href="#identifier">Identifier</a> \| null</code>           |
| **`type`** | <code>'<a href="#functionexpression">FunctionExpression</a>'</code> |
| **`body`** | <code><a href="#blockstatement">BlockStatement</a></code>           |


#### ArrowFunctionExpression

| Prop             | Type                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#arrowfunctionexpression">ArrowFunctionExpression</a>'</code>                     |
| **`expression`** | <code>boolean</code>                                                                              |
| **`body`**       | <code><a href="#blockstatement">BlockStatement</a> \| <a href="#expression">Expression</a></code> |


#### YieldExpression

| Prop           | Type                                                          |
| -------------- | ------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#yieldexpression">YieldExpression</a>'</code> |
| **`argument`** | <code><a href="#expression">Expression</a> \| null</code>     |
| **`delegate`** | <code>boolean</code>                                          |


#### SimpleLiteral

| Prop        | Type                                             |
| ----------- | ------------------------------------------------ |
| **`type`**  | <code>'<a href="#literal">Literal</a>'</code>    |
| **`value`** | <code>string \| number \| boolean \| null</code> |
| **`raw`**   | <code>string</code>                              |


#### RegExpLiteral

| Prop        | Type                                              |
| ----------- | ------------------------------------------------- |
| **`type`**  | <code>'<a href="#literal">Literal</a>'</code>     |
| **`value`** | <code><a href="#regexp">RegExp</a> \| null</code> |
| **`regex`** | <code>{ pattern: string; flags: string; }</code>  |
| **`raw`**   | <code>string</code>                               |


#### RegExp

| Prop             | Type                 | Description                                                                                                                                                          |
| ---------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`source`**     | <code>string</code>  | Returns a copy of the text of the regular expression pattern. Read-only. The regExp argument is a Regular expression object. It can be a variable name or a literal. |
| **`global`**     | <code>boolean</code> | Returns a Boolean value indicating the state of the global flag (g) used with a regular expression. Default is false. Read-only.                                     |
| **`ignoreCase`** | <code>boolean</code> | Returns a Boolean value indicating the state of the ignoreCase flag (i) used with a regular expression. Default is false. Read-only.                                 |
| **`multiline`**  | <code>boolean</code> | Returns a Boolean value indicating the state of the multiline flag (m) used with a regular expression. Default is false. Read-only.                                  |
| **`lastIndex`**  | <code>number</code>  |                                                                                                                                                                      |

| Method      | Signature                                                                     | Description                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **exec**    | (string: string) =&gt; <a href="#regexpexecarray">RegExpExecArray</a> \| null | Executes a search on a string using a regular expression pattern, and returns an array containing the results of that search. |
| **test**    | (string: string) =&gt; boolean                                                | Returns a Boolean value that indicates whether or not a pattern exists in a searched string.                                  |
| **compile** | () =&gt; this                                                                 |                                                                                                                               |


#### RegExpExecArray

| Prop        | Type                |
| ----------- | ------------------- |
| **`index`** | <code>number</code> |
| **`input`** | <code>string</code> |


#### BigIntLiteral

| Prop         | Type                                          |
| ------------ | --------------------------------------------- |
| **`type`**   | <code>'<a href="#literal">Literal</a>'</code> |
| **`value`**  | <code>bigint \| null</code>                   |
| **`bigint`** | <code>string</code>                           |
| **`raw`**    | <code>string</code>                           |


#### UnaryExpression

| Prop           | Type                                                          |
| -------------- | ------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#unaryexpression">UnaryExpression</a>'</code> |
| **`operator`** | <code><a href="#unaryoperator">UnaryOperator</a></code>       |
| **`prefix`**   | <code>true</code>                                             |
| **`argument`** | <code><a href="#expression">Expression</a></code>             |


#### UpdateExpression

| Prop           | Type                                                            |
| -------------- | --------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#updateexpression">UpdateExpression</a>'</code> |
| **`operator`** | <code><a href="#updateoperator">UpdateOperator</a></code>       |
| **`argument`** | <code><a href="#expression">Expression</a></code>               |
| **`prefix`**   | <code>boolean</code>                                            |


#### BinaryExpression

| Prop           | Type                                                            |
| -------------- | --------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#binaryexpression">BinaryExpression</a>'</code> |
| **`operator`** | <code><a href="#binaryoperator">BinaryOperator</a></code>       |
| **`left`**     | <code><a href="#expression">Expression</a></code>               |
| **`right`**    | <code><a href="#expression">Expression</a></code>               |


#### AssignmentExpression

| Prop           | Type                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#assignmentexpression">AssignmentExpression</a>'</code> |
| **`operator`** | <code><a href="#assignmentoperator">AssignmentOperator</a></code>       |
| **`left`**     | <code><a href="#pattern">Pattern</a></code>                             |
| **`right`**    | <code><a href="#expression">Expression</a></code>                       |


#### LogicalExpression

| Prop           | Type                                                              |
| -------------- | ----------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#logicalexpression">LogicalExpression</a>'</code> |
| **`operator`** | <code><a href="#logicaloperator">LogicalOperator</a></code>       |
| **`left`**     | <code><a href="#expression">Expression</a></code>                 |
| **`right`**    | <code><a href="#expression">Expression</a></code>                 |


#### ConditionalExpression

| Prop             | Type                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#conditionalexpression">ConditionalExpression</a>'</code> |
| **`test`**       | <code><a href="#expression">Expression</a></code>                         |
| **`alternate`**  | <code><a href="#expression">Expression</a></code>                         |
| **`consequent`** | <code><a href="#expression">Expression</a></code>                         |


#### SimpleCallExpression

| Prop           | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| **`type`**     | <code>'<a href="#callexpression">CallExpression</a>'</code> |
| **`optional`** | <code>boolean</code>                                        |


#### NewExpression

| Prop       | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`type`** | <code>'<a href="#newexpression">NewExpression</a>'</code> |


#### SequenceExpression

| Prop              | Type                                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| **`type`**        | <code>'<a href="#sequenceexpression">SequenceExpression</a>'</code>                 |
| **`expressions`** | <code><a href="#array">Array</a>&lt;<a href="#expression">Expression</a>&gt;</code> |


#### TemplateLiteral

| Prop              | Type                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| **`type`**        | <code>'<a href="#templateliteral">TemplateLiteral</a>'</code>                                 |
| **`quasis`**      | <code><a href="#array">Array</a>&lt;<a href="#templateelement">TemplateElement</a>&gt;</code> |
| **`expressions`** | <code><a href="#array">Array</a>&lt;<a href="#expression">Expression</a>&gt;</code>           |


#### TemplateElement

| Prop        | Type                                                          |
| ----------- | ------------------------------------------------------------- |
| **`type`**  | <code>'<a href="#templateelement">TemplateElement</a>'</code> |
| **`tail`**  | <code>boolean</code>                                          |
| **`value`** | <code>{ cooked?: string \| null; raw: string; }</code>        |


#### TaggedTemplateExpression

| Prop        | Type                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| **`type`**  | <code>'<a href="#taggedtemplateexpression">TaggedTemplateExpression</a>'</code> |
| **`tag`**   | <code><a href="#expression">Expression</a></code>                               |
| **`quasi`** | <code><a href="#templateliteral">TemplateLiteral</a></code>                     |


#### ClassExpression

| Prop       | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`type`** | <code>'<a href="#classexpression">ClassExpression</a>'</code> |
| **`id`**   | <code><a href="#identifier">Identifier</a> \| null</code>     |


#### MetaProperty

| Prop           | Type                                                    |
| -------------- | ------------------------------------------------------- |
| **`type`**     | <code>'<a href="#metaproperty">MetaProperty</a>'</code> |
| **`meta`**     | <code><a href="#identifier">Identifier</a></code>       |
| **`property`** | <code><a href="#identifier">Identifier</a></code>       |


#### AwaitExpression

| Prop           | Type                                                          |
| -------------- | ------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#awaitexpression">AwaitExpression</a>'</code> |
| **`argument`** | <code><a href="#expression">Expression</a></code>             |


#### ImportExpression

| Prop         | Type                                                            |
| ------------ | --------------------------------------------------------------- |
| **`type`**   | <code>'<a href="#importexpression">ImportExpression</a>'</code> |
| **`source`** | <code><a href="#expression">Expression</a></code>               |


#### ChainExpression

| Prop             | Type                                                          |
| ---------------- | ------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#chainexpression">ChainExpression</a>'</code> |
| **`expression`** | <code><a href="#chainelement">ChainElement</a></code>         |


#### EmptyStatement

| Prop       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| **`type`** | <code>'<a href="#emptystatement">EmptyStatement</a>'</code> |


#### DebuggerStatement

| Prop       | Type                                                              |
| ---------- | ----------------------------------------------------------------- |
| **`type`** | <code>'<a href="#debuggerstatement">DebuggerStatement</a>'</code> |


#### WithStatement

| Prop         | Type                                                      |
| ------------ | --------------------------------------------------------- |
| **`type`**   | <code>'<a href="#withstatement">WithStatement</a>'</code> |
| **`object`** | <code><a href="#expression">Expression</a></code>         |
| **`body`**   | <code><a href="#statement">Statement</a></code>           |


#### ReturnStatement

| Prop           | Type                                                          |
| -------------- | ------------------------------------------------------------- |
| **`type`**     | <code>'<a href="#returnstatement">ReturnStatement</a>'</code> |
| **`argument`** | <code><a href="#expression">Expression</a> \| null</code>     |


#### LabeledStatement

| Prop        | Type                                                            |
| ----------- | --------------------------------------------------------------- |
| **`type`**  | <code>'<a href="#labeledstatement">LabeledStatement</a>'</code> |
| **`label`** | <code><a href="#identifier">Identifier</a></code>               |
| **`body`**  | <code><a href="#statement">Statement</a></code>                 |


#### BreakStatement

| Prop        | Type                                                        |
| ----------- | ----------------------------------------------------------- |
| **`type`**  | <code>'<a href="#breakstatement">BreakStatement</a>'</code> |
| **`label`** | <code><a href="#identifier">Identifier</a> \| null</code>   |


#### ContinueStatement

| Prop        | Type                                                              |
| ----------- | ----------------------------------------------------------------- |
| **`type`**  | <code>'<a href="#continuestatement">ContinueStatement</a>'</code> |
| **`label`** | <code><a href="#identifier">Identifier</a> \| null</code>         |


#### IfStatement

| Prop             | Type                                                    |
| ---------------- | ------------------------------------------------------- |
| **`type`**       | <code>'<a href="#ifstatement">IfStatement</a>'</code>   |
| **`test`**       | <code><a href="#expression">Expression</a></code>       |
| **`consequent`** | <code><a href="#statement">Statement</a></code>         |
| **`alternate`**  | <code><a href="#statement">Statement</a> \| null</code> |


#### SwitchStatement

| Prop               | Type                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| **`type`**         | <code>'<a href="#switchstatement">SwitchStatement</a>'</code>                       |
| **`discriminant`** | <code><a href="#expression">Expression</a></code>                                   |
| **`cases`**        | <code><a href="#array">Array</a>&lt;<a href="#switchcase">SwitchCase</a>&gt;</code> |


#### SwitchCase

| Prop             | Type                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| **`type`**       | <code>'<a href="#switchcase">SwitchCase</a>'</code>                               |
| **`test`**       | <code><a href="#expression">Expression</a> \| null</code>                         |
| **`consequent`** | <code><a href="#array">Array</a>&lt;<a href="#statement">Statement</a>&gt;</code> |


#### ThrowStatement

| Prop           | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| **`type`**     | <code>'<a href="#throwstatement">ThrowStatement</a>'</code> |
| **`argument`** | <code><a href="#expression">Expression</a></code>           |


#### TryStatement

| Prop            | Type                                                              |
| --------------- | ----------------------------------------------------------------- |
| **`type`**      | <code>'<a href="#trystatement">TryStatement</a>'</code>           |
| **`block`**     | <code><a href="#blockstatement">BlockStatement</a></code>         |
| **`handler`**   | <code><a href="#catchclause">CatchClause</a> \| null</code>       |
| **`finalizer`** | <code><a href="#blockstatement">BlockStatement</a> \| null</code> |


#### CatchClause

| Prop        | Type                                                      |
| ----------- | --------------------------------------------------------- |
| **`type`**  | <code>'<a href="#catchclause">CatchClause</a>'</code>     |
| **`param`** | <code><a href="#pattern">Pattern</a> \| null</code>       |
| **`body`**  | <code><a href="#blockstatement">BlockStatement</a></code> |


#### WhileStatement

| Prop       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| **`type`** | <code>'<a href="#whilestatement">WhileStatement</a>'</code> |
| **`test`** | <code><a href="#expression">Expression</a></code>           |
| **`body`** | <code><a href="#statement">Statement</a></code>             |


#### DoWhileStatement

| Prop       | Type                                                            |
| ---------- | --------------------------------------------------------------- |
| **`type`** | <code>'<a href="#dowhilestatement">DoWhileStatement</a>'</code> |
| **`body`** | <code><a href="#statement">Statement</a></code>                 |
| **`test`** | <code><a href="#expression">Expression</a></code>               |


#### ForStatement

| Prop         | Type                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| **`type`**   | <code>'<a href="#forstatement">ForStatement</a>'</code>                                                             |
| **`init`**   | <code><a href="#variabledeclaration">VariableDeclaration</a> \| <a href="#expression">Expression</a> \| null</code> |
| **`test`**   | <code><a href="#expression">Expression</a> \| null</code>                                                           |
| **`update`** | <code><a href="#expression">Expression</a> \| null</code>                                                           |
| **`body`**   | <code><a href="#statement">Statement</a></code>                                                                     |


#### VariableDeclaration

| Prop               | Type                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **`type`**         | <code>'<a href="#variabledeclaration">VariableDeclaration</a>'</code>                               |
| **`declarations`** | <code><a href="#array">Array</a>&lt;<a href="#variabledeclarator">VariableDeclarator</a>&gt;</code> |
| **`kind`**         | <code>'var' \| 'let' \| 'const'</code>                                                              |


#### VariableDeclarator

| Prop       | Type                                                                |
| ---------- | ------------------------------------------------------------------- |
| **`type`** | <code>'<a href="#variabledeclarator">VariableDeclarator</a>'</code> |
| **`id`**   | <code><a href="#pattern">Pattern</a></code>                         |
| **`init`** | <code><a href="#expression">Expression</a> \| null</code>           |


#### ForInStatement

| Prop       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| **`type`** | <code>'<a href="#forinstatement">ForInStatement</a>'</code> |


#### ForOfStatement

| Prop        | Type                                                        |
| ----------- | ----------------------------------------------------------- |
| **`type`**  | <code>'<a href="#forofstatement">ForOfStatement</a>'</code> |
| **`await`** | <code>boolean</code>                                        |


#### ClassDeclaration

| Prop       | Type                                                            | Description                                                                           |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **`type`** | <code>'<a href="#classdeclaration">ClassDeclaration</a>'</code> |                                                                                       |
| **`id`**   | <code><a href="#identifier">Identifier</a> \| null</code>       | It is null when a class declaration is a part of the `export default class` statement |


#### Comment

| Prop        | Type                           |
| ----------- | ------------------------------ |
| **`type`**  | <code>'Line' \| 'Block'</code> |
| **`value`** | <code>string</code>            |


### Type Aliases


#### MPConfigType

<code>{ isDevelopmentMode?: boolean, dataPlan?: { planId?: string, planVersion?: number }, identifyRequest?: any, logLevel?: string, identityCallback?: (i: <a href="#identityresult">IdentityResult</a>) =&gt; void, }</code>


#### MPID

<code>string</code>


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>


#### UserAttributesValue

<code>string | number | boolean | null</code>


#### AllUserAttributes

<code><a href="#record">Record</a>&lt; string, <a href="#userattributesvalue">UserAttributesValue</a> | UserAttributesValue[] &gt;</code>


#### CCPAConsentState

<code><a href="#privacyconsentstate">PrivacyConsentState</a></code>


#### Function

<code><a href="#functiondeclaration">FunctionDeclaration</a> | <a href="#functionexpression">FunctionExpression</a> | <a href="#arrowfunctionexpression">ArrowFunctionExpression</a></code>


#### Statement

<code><a href="#expressionstatement">ExpressionStatement</a> | <a href="#blockstatement">BlockStatement</a> | <a href="#emptystatement">EmptyStatement</a> | <a href="#debuggerstatement">DebuggerStatement</a> | <a href="#withstatement">WithStatement</a> | <a href="#returnstatement">ReturnStatement</a> | <a href="#labeledstatement">LabeledStatement</a> | <a href="#breakstatement">BreakStatement</a> | <a href="#continuestatement">ContinueStatement</a> | <a href="#ifstatement">IfStatement</a> | <a href="#switchstatement">SwitchStatement</a> | <a href="#throwstatement">ThrowStatement</a> | <a href="#trystatement">TryStatement</a> | <a href="#whilestatement">WhileStatement</a> | <a href="#dowhilestatement">DoWhileStatement</a> | <a href="#forstatement">ForStatement</a> | <a href="#forinstatement">ForInStatement</a> | <a href="#forofstatement">ForOfStatement</a> | <a href="#declaration">Declaration</a></code>


#### Expression

<code><a href="#thisexpression">ThisExpression</a> | <a href="#arrayexpression">ArrayExpression</a> | <a href="#objectexpression">ObjectExpression</a> | <a href="#functionexpression">FunctionExpression</a> | <a href="#arrowfunctionexpression">ArrowFunctionExpression</a> | <a href="#yieldexpression">YieldExpression</a> | <a href="#literal">Literal</a> | <a href="#unaryexpression">UnaryExpression</a> | <a href="#updateexpression">UpdateExpression</a> | <a href="#binaryexpression">BinaryExpression</a> | <a href="#assignmentexpression">AssignmentExpression</a> | <a href="#logicalexpression">LogicalExpression</a> | <a href="#memberexpression">MemberExpression</a> | <a href="#conditionalexpression">ConditionalExpression</a> | <a href="#callexpression">CallExpression</a> | <a href="#newexpression">NewExpression</a> | <a href="#sequenceexpression">SequenceExpression</a> | <a href="#templateliteral">TemplateLiteral</a> | <a href="#taggedtemplateexpression">TaggedTemplateExpression</a> | <a href="#classexpression">ClassExpression</a> | <a href="#metaproperty">MetaProperty</a> | <a href="#identifier">Identifier</a> | <a href="#awaitexpression">AwaitExpression</a> | <a href="#importexpression">ImportExpression</a> | <a href="#chainexpression">ChainExpression</a></code>


#### Pattern

<code><a href="#identifier">Identifier</a> | <a href="#objectpattern">ObjectPattern</a> | <a href="#arraypattern">ArrayPattern</a> | <a href="#restelement">RestElement</a> | <a href="#assignmentpattern">AssignmentPattern</a> | <a href="#memberexpression">MemberExpression</a></code>


#### Literal

<code><a href="#simpleliteral">SimpleLiteral</a> | <a href="#regexpliteral">RegExpLiteral</a> | <a href="#bigintliteral">BigIntLiteral</a></code>


#### UnaryOperator

<code>"-" | "+" | "!" | "~" | "typeof" | "void" | "delete"</code>


#### UpdateOperator

<code>"++" | "--"</code>


#### BinaryOperator

<code>"==" | "!=" | "===" | "!==" | "&lt;" | "&lt;=" | "&gt;" | "&gt;=" | "&lt;&lt;" | "&gt;&gt;" | "&gt;&gt;&gt;" | "+" | "-" | "*" | "/" | "%" | "**" | "|" | "^" | "&" | "in" | "instanceof"</code>


#### AssignmentOperator

<code>"=" | "+=" | "-=" | "*=" | "/=" | "%=" | "**=" | "&lt;&lt;=" | "&gt;&gt;=" | "&gt;&gt;&gt;=" | "|=" | "^=" | "&="</code>


#### LogicalOperator

<code>"||" | "&&" | "??"</code>


#### CallExpression

<code><a href="#simplecallexpression">SimpleCallExpression</a> | <a href="#newexpression">NewExpression</a></code>


#### ChainElement

<code><a href="#simplecallexpression">SimpleCallExpression</a> | <a href="#memberexpression">MemberExpression</a></code>


#### Declaration

<code><a href="#functiondeclaration">FunctionDeclaration</a> | <a href="#variabledeclaration">VariableDeclaration</a> | <a href="#classdeclaration">ClassDeclaration</a></code>

</docgen-api>
