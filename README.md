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
* [`logMPEvent(...)`](#logmpevent)
* [`addListener(...)`](#addlistener)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => any
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>any</code>

--------------------


### helloMP()

```typescript
helloMP() => any
```

**Returns:** <code>any</code>

--------------------


### mParticleInit(...)

```typescript
mParticleInit(call: any) => any
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>any</code>

--------------------


### logMPEvent(...)

```typescript
logMPEvent(call: any) => any
```

| Param      | Type             |
| ---------- | ---------------- |
| **`call`** | <code>any</code> |

**Returns:** <code>any</code>

--------------------


### addListener(...)

```typescript
addListener(eventName: 'mParticleInit', listenerFunc: mParticleInitListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                               |
| ------------------ | ---------------------------------- |
| **`eventName`**    | <code>"mParticleInit"</code>       |
| **`listenerFunc`** | <code>(info: any) =&gt; any</code> |

**Returns:** <code>any</code>

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                      |
| ------------ | ------------------------- |
| **`remove`** | <code>() =&gt; any</code> |

</docgen-api>
