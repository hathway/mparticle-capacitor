# mparticle-capacitor

mParticle Capacitor Plugin to avoid enterprise

## Install

```bash
npm install mparticle-capacitor
npx cap sync
```

## Baze Integration

There are some custom settings that need to be included in your project for mParticle to route data to Braze.

### Android

Android will complain about not finding a package unless you include this repo in your `app/build.gradle`:
<code>
repositories {
    maven { url "https://appboy.github.io/appboy-android-sdk/sdk" }
    ...
}
</code>

### iOS

Initilize mParticle in the app directly instead of the plugin, Appboy/Braze needs the permissions mParticle will pass to it through this.
`AppDelegate.swift`

<code>
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let options = MParticleOptions(key: {{your key here}}, secret: {{matching secret here}})
        MParticle.sharedInstance().start(with: options)
        return true
}
</code>

#### swizzling (My token isn't getting to Braze)

Look for functions that override or proxy the AppDelegate functions. ex:
- https://firebase.google.com/docs/cloud-messaging/ios/client

<code>
The FCM SDK performs method swizzling in two key areas: mapping your APNs token to the FCM registration token and capturing analytics data during downstream message callback handling. Developers who prefer not to use swizzling can disable it by adding the flag FirebaseAppDelegateProxyEnabled in the app’s Info.plist file and setting it to NO (boolean value). Relevant areas of the guides provide code examples, both with and without method swizzling enabled.
</code>

solution is in your Info.plist: https://i.stack.imgur.com/XnMm0.png -> (via. https://firebase.google.com/docs/cloud-messaging/ios/client)

in this case we dont want this to override ``` didRegisterForRemoteNotificationsWithDeviceToken ``` because MPartle has its own proxy functions. 

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
