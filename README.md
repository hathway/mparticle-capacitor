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
> The FCM SDK performs method swizzling in two key areas: mapping your APNs token to the FCM registration token and capturing analytics data during downstream message callback handling. Developers who prefer not to use swizzling can disable it by adding the flag FirebaseAppDelegateProxyEnabled in the app???s Info.plist file and setting it to NO (boolean value). Relevant areas of the guides provide code examples, both with and without method swizzling enabled.

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
mParticleConfig(call: { isDevelopmentMode?: boolean; planID?: string; planVer?: number; logLevel?: string; identifyRequest?: any; identityCallback?: Function; }) => Promise<MPConfigType>
```

| Param      | Type                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`call`** | <code>{ isDevelopmentMode?: boolean; planID?: string; planVer?: number; logLevel?: string; identifyRequest?: any; identityCallback?: <a href="#function">Function</a>; }</code> |

**Returns:** <code>Promise&lt;MPConfigType&gt;</code>

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

</docgen-api>
