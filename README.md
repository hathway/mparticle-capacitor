# mparticle-capacitor

mParticle Capacitor Plugin to avoid enterprise

## Install

```bash
npm install mparticle-capacitor
npx cap sync
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`helloMP()`](#hellomp)
* [`mParticleInit(...)`](#mparticleinit)
* [`logMParticleEvent(...)`](#logmparticleevent)
* [`logMParticlePageView(...)`](#logmparticlepageview)
* [`setUserAttribute(...)`](#setuserattribute)
* [`setUserAttributeList(...)`](#setuserattributelist)
* [`getUserAttributeLists(...)`](#getuserattributelists)
* [`loginMParticleUser(...)`](#loginmparticleuser)
* [`logoutMParticleUser(...)`](#logoutmparticleuser)
* [`addListener(...)`](#addlistener)
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


### helloMP()

```typescript
helloMP() => Promise<string>
```

**Returns:** <code>Promise&lt;string&gt;</code>

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


### getUserAttributeLists(...)

```typescript
getUserAttributeLists(_call: any) => Promise<any>
```

| Param       | Type             |
| ----------- | ---------------- |
| **`_call`** | <code>any</code> |

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


### addListener(...)

```typescript
addListener(eventName: 'mParticleInit', listenerFunc: mParticleInitListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                               |
| ------------------ | ---------------------------------- |
| **`eventName`**    | <code>"mParticleInit"</code>       |
| **`listenerFunc`** | <code>(info: any) =&gt; any</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

</docgen-api>
