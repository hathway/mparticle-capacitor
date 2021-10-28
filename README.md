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
