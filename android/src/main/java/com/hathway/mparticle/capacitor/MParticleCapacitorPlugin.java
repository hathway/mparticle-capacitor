package com.hathway.mparticle.capacitor;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

//import mParticle
import com.mparticle.MParticle;
import com.mparticle.MParticleOptions;
import com.mparticle.MParticle.EventType;
import com.mparticle.MParticle.ServiceProviders;
import com.mparticle.identity.IdentityApiRequest;
import com.mparticle.commerce.Product;
import com.mparticle.commerce.CommerceEvent;
import com.mparticle.commerce.CommerceEvent.Builder;
import com.mparticle.commerce.TransactionAttributes;
import com.mparticle.*;
import java.util.*;
import org.json.JSONException;

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
        MParticleOptions options = MParticleOptions.builder(this.getContext())
                .credentials(
                    "us1-8c8c91aa9ec62c46bb6d33502d11bac1", 
                    "BCBZ7JzoS5i_mVmiWWsq12JspNQt_tF7G5iiNgIT4FJXO1kwGlB6rvgRRtDbPOc2"
                    )
                .environment(MParticle.Environment.Development)
                .logLevel(MParticle.LogLevel.DEBUG)
                .build();
        MParticle.start(options);
        // System.out.println("******************** APPBOY VAR HERE ************");
        // System.out.println(MParticle.getInstance().isKitActive(ServiceProviders.APPBOY));
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void logMParticleEvent(PluginCall call) {
        System.out.println("***************************************** LOOK HERE ************************");
        System.out.println(call.getData());
        System.out.println("***************************************** LOOK HERE ************************");
        // call.unimplemented("Not implemented on Android.");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("eventProperties");
        // System.out.println(temp);
        System.out.println(temp);
        System.out.println("***************************************** LOOK HERE ************************");
        Iterator<String> iter = temp.keys();
        while (iter.hasNext()) {
            String key = iter.next();
            try {
                Object value = temp.get(key);
                System.out.println(key);
                System.out.println(value);
                System.out.println(",");
                customAttributes.put(key, value.toString());
                } catch (JSONException e) {
                // Something went wrong!
            }
        }
        String name = call.getString("eventName");
        int type = call.getInt("eventType");

        MPEvent event = new MPEvent.Builder(name, implementation.getEventType(type))
            .customAttributes(customAttributes)
            .build();

        MParticle.getInstance().logEvent(event);
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void logMParticlePageView(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        String name = call.getString("pageName");
        String link = call.getString("pageLink");
        Map<String, String> screenInfo = new HashMap<String, String>();
        screenInfo.put("page", link);
        MParticle.getInstance().logScreen(name, screenInfo );
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void setUserAttribute(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        String name = call.getString("attributeName");
        String value = call.getString("attributeValue");
        implementation.currentUser().setUserAttribute(name,value);
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void getUserAttributeLists(PluginCall call) {
        call.unimplemented("Not implemented on Android.");
        // System.out.println(implementation.currentUser().getUserAttributes().toString());
        // call.resolve(new JSObject(implementation.currentUser().getUserAttributes()));
    }

    @PluginMethod
    public void setUserAttributeList(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        String name = call.getString("attributeName");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("attributeValues");
        Iterator<String> iter = temp.keys();
        while (iter.hasNext()) {
            String key = iter.next();
            try {
                Object value = temp.get(key);
                customAttributes.put(key, value.toString());
                } catch (JSONException e) {
                // Something went wrong!
            }
        }
        implementation.currentUser().setUserAttributeList(name,customAttributes);
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void updateMParticleCart(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        int type = call.getInt("eventType");
        JSObject product_tmp = call.getObject("product");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        Iterator<String> iter = temp.keys();
        while (iter.hasNext()) {
            String key = iter.next();
            try {
                Object value = temp.get(key);
                customAttributes.put(key, value.toString());
                } catch (JSONException e) {
                // Something went wrong!
            }
        }
        Product product = implementation.createMParticleProduct(product_tmp);
        TransactionAttributes attributes = new TransactionAttributes();
        CommerceEvent event = new CommerceEvent.Builder(implementation.getProductEventType(type), product)
        .customAttributes(customAttributes)    
        .transactionAttributes(attributes)
        .build();
        MParticle.getInstance().logEvent(event);
    }

    @PluginMethod
    public void addMParticleProduct(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        JSObject product_tmp = call.getObject("product");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        Iterator<String> iter = temp.keys();
        while (iter.hasNext()) {
            String key = iter.next();
            try {
                Object value = temp.get(key);
                customAttributes.put(key, value.toString());
                } catch (JSONException e) {
                // Something went wrong!
            }
        }
        Product product = implementation.createMParticleProduct(product_tmp);
        TransactionAttributes attributes = new TransactionAttributes();
        CommerceEvent event = new CommerceEvent.Builder(Product.ADD_TO_CART, product)
        .customAttributes(customAttributes)    
        .transactionAttributes(attributes)
        .build();
        MParticle.getInstance().logEvent(event);
    }

    @PluginMethod
    public void removeMParticleProduct(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        JSObject product_tmp = call.getObject("product");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        Iterator<String> iter = temp.keys();
        while (iter.hasNext()) {
            String key = iter.next();
            try {
                Object value = temp.get(key);
                customAttributes.put(key, value.toString());
                } catch (JSONException e) {
                // Something went wrong!
            }
        }
        Product product = implementation.createMParticleProduct(product_tmp);
        TransactionAttributes attributes = new TransactionAttributes();
        CommerceEvent event = new CommerceEvent.Builder(Product.REMOVE_FROM_CART, product)
        .customAttributes(customAttributes)    
        .transactionAttributes(attributes)
        .build();
        MParticle.getInstance().logEvent(event);

    }

    @PluginMethod
    public void submitPurchaseEvent(PluginCall call) {
        call.unimplemented("Not implemented on Android.");
    }

    @PluginMethod
    public void loginMParticleUser(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        String email = call.getString("email");
        String customerId = call.getString("customerId");
        MParticle.getInstance().Identity().login(implementation.identityRequest(email,customerId));
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void logoutMParticleUser(PluginCall call) {
        // call.unimplemented("Not implemented on Android.");
        MParticle.getInstance().Identity().logout(IdentityApiRequest.withEmptyUser().build());
        call.resolve(new JSObject());
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
