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
        call.unimplemented("Not implemented on Android.");
    }

    @PluginMethod
    public void logMPEvent(PluginCall call) {
        call.unimplemented("Not implemented on Android.");
    }

    // @PluginMethod
    // public void mParticleInit(PluginCall call) {
    //     MParticleOptions options = MParticleOptions.builder(this)
    //             .credentials(
    //                 "us1-279d6248523ab840bb39cfc8d4799691", 
    //                 "wNbwpQ7Rh-W4AHB_Cr2M59YZcFoDiFS8uaOhIB8-MV82Nehtn6zgdbVErbA-ncS7"
    //                 )
    //             .environment(MParticle.Environment.Development)
    //             .build();
    //     MParticle.start(options);
    //     call.resolve(new JSObject());
    // }

    // @PluginMethod
    // public void logMPEvent(PluginCall call) {
    //     System.out.println(call);
    //     Map<String, String> customAttributes = new HashMap<String, String>();
    //     customAttributes = (HashMap<String, String>) call.eventProperties;

    //     MPEvent event = new MPEvent.Builder(call.eventName, EventType.init(call.eventType))
    //         .customAttributes(customAttributes)
    //         .build();

    //     MParticle.getInstance().logEvent(event);
    //     call.resolve(new JSObject());
    // }
}
