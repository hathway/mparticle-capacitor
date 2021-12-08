# mparticle-capacitor

mParticle Capacitor Plugin to avoid enterprise

## Install

```bash
npm install git+https://github.com/dghathway/mparticle-capacitor.git#v0.0.7
npx cap sync
```
or add to your `package.json`
```json
"mparticle-capacitor": "git+https://github.com/dghathway/mparticle-capacitor.git#v0.0.7"
```

## AppDelegate & MainActivity Scripts

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
        .build();
        MParticle.start(options);
    }
}
```

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

## Baze Integration

mParticle will handle the integration internaly as long as things are hooked up in the dashboard. 
There are some custom settings and inclusions that need to be included in your project for mParticle to route data to Braze properly.

### Android

Android will complain about not finding a package unless you include this repo in your `build.gradle`:

```gradle
repositories {
    maven { url "https://appboy.github.io/appboy-android-sdk/sdk" }
    ...
}
```

#### Enable Push Notifications

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

### iOS

mParticle will handle the integration internaly. There may be issues depending on other packages in your app. Full mParticle documentation here: https://docs.mparticle.com/developers/sdk/ios/push-notifications/

> iOS does not pass push tokens automatically, for your hybrid app I recommend using: https://capacitorjs.com/docs/apis/push-notifications to request and enable push notifictaions for your users

### Device Push Tokens Aren't Getting to Braze (swizzling)

Look for functions that override or proxy the AppDelegate functions specifically `didRegisterForRemoteNotificationsWithDeviceToken`. Firebase Gets in the way of Braze And mParticle interactions 
> ref: https://firebase.google.com/docs/cloud-messaging/ios/client
> The FCM SDK performs method swizzling in two key areas: mapping your APNs token to the FCM registration token and capturing analytics data during downstream message callback handling. Developers who prefer not to use swizzling can disable it by adding the flag FirebaseAppDelegateProxyEnabled in the app’s Info.plist file and setting it to NO (boolean value). Relevant areas of the guides provide code examples, both with and without method swizzling enabled.

solution is in your ```Info.plist```: 
    ![info.plist firebase](https://i.stack.imgur.com/XnMm0.png)
> (via. https://firebase.google.com/docs/cloud-messaging/ios/client)

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`mParticleInit(...)`](#mparticleinit)
* [`logMParticleEvent(...)`](#logmparticleevent)
* [`logMParticlePageView(...)`](#logmparticlepageview)
* [`setUserAttribute(...)`](#setuserattribute)
* [`setUserAttributeList(...)`](#setuserattributelist)
* [`updateMParticleCart(...)`](#updatemparticlecart)
* [`addMParticleProduct(...)`](#addmparticleproduct)
* [`removeMParticleProduct(...)`](#removemparticleproduct)
* [`submitPurchaseEvent(...)`](#submitpurchaseevent)
* [`loginMParticleUser(...)`](#loginmparticleuser)
* [`logoutMParticleUser(...)`](#logoutmparticleuser)
* [`registerMParticleUser(...)`](#registermparticleuser)

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


### mParticleInit(...)

```typescript
mParticleInit(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### logMParticleEvent(...)

```typescript
logMParticleEvent(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### logMParticlePageView(...)

```typescript
logMParticlePageView(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### setUserAttribute(...)

```typescript
setUserAttribute(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### setUserAttributeList(...)

```typescript
setUserAttributeList(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### updateMParticleCart(...)

```typescript
updateMParticleCart(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### addMParticleProduct(...)

```typescript
addMParticleProduct(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### removeMParticleProduct(...)

```typescript
removeMParticleProduct(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### submitPurchaseEvent(...)

```typescript
submitPurchaseEvent(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### loginMParticleUser(...)

```typescript
loginMParticleUser(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

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


### registerMParticleUser(...)

```typescript
registerMParticleUser(call: any) => Promise<any>
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------

</docgen-api>
