package com.hathway.mparticle.capacitor;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "MParticleCapacitor")
public class MParticleCapacitorPlugin extends Plugin {

    private MParticleCapacitor implementation = new MParticleCapacitor();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void helloMP(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("value", implementation.echo("helloMP Android"));
        call.resolve(ret);
    }

    @PluginMethod
    public void mParticleInit(PluginCall call) {
        call.unimplemented('Not implemented on Android.');
    }

    @PluginMethod
    public void logMPEvent(PluginCall call) {
        call.unimplemented('Not implemented on Android.');
    }
}
