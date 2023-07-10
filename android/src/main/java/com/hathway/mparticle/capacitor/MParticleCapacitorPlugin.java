package com.hathway.mparticle.capacitor;

import com.getcapacitor.JSArray;
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
import com.mparticle.identity.IdentityApiResult;
import com.mparticle.identity.TaskSuccessListener;
import com.mparticle.*;
import java.util.*;
import org.json.JSONException;
import org.json.JSONObject;

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
    public void mParticleInit(PluginCall call) {
        call.unimplemented("Moved for Braze compatability.");
        // String key = call.getString("key");
        // String secret = call.getString("secret");
        // MParticleOptions options = MParticleOptions.builder(this.getContext())
        //         .credentials(
        //             key, 
        //             secret
        //             )
        //         .environment(MParticle.Environment.Development)
        //         .logLevel(MParticle.LogLevel.DEBUG)
        //         .build();
        // MParticle.start(options);
        // call.resolve(new JSObject());
    }

    @PluginMethod
    public void logMParticleEvent(PluginCall call) {
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("eventProperties");
        if (temp != null) {
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
        String name = call.getString("pageName");
        String link = call.getString("pageLink");
        String optionalAttribute = call.getObject("overrides").getString("attributeName");
        String attributeName = optionalAttribute != null ? optionalAttribute : "page";

        Map<String, String> screenInfo = new HashMap<String, String>();
        screenInfo.put(attributeName, link);
        MParticle.getInstance().logScreen(name, screenInfo );
        call.resolve(new JSObject());
    }

    /**
     * Convert a JSONObject into a JSObject
     * @param obj
     */
    public static JSObject fromJSONObject(JSONObject obj) throws JSONException {
        Iterator<String> keysIter = obj.keys();
        List<String> keys = new ArrayList<>();
        while (keysIter.hasNext()) {
            keys.add(keysIter.next());
        }
        return new JSObject(obj, keys.toArray(new String[keys.size()]));
    }

    @PluginMethod
    public void getAllUserAttributes(PluginCall call) throws JSONException {
        Map<String, Object> userAttr = new HashMap<String, Object>();
        if (implementation.currentUser() != null) {
            userAttr = implementation.currentUser().getUserAttributes();
        }
        call.resolve(fromJSONObject(new JSONObject(userAttr)));
    }

    @PluginMethod
    public void setUserAttribute(PluginCall call) {
        String name = call.getString("attributeName");
        String value = call.getString("attributeValue");
        if (implementation.currentUser() != null) {
            implementation.currentUser().setUserAttribute(name,value);
        }
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void removeUserAttribute(PluginCall call) {
        String name = call.getString("attributeName");
        if (implementation.currentUser() != null) {
            implementation.currentUser().removeUserAttribute(name);
        }
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void setUserAttributeList(PluginCall call) {
        String name = call.getString("attributeName");
        JSArray list_tmp = call.getArray("attributeValues");
        List<String> attributeList = new ArrayList<>();
        try {
            attributeList = list_tmp.toList();
        } catch (JSONException e) {}
        if (implementation.currentUser() != null) {
            implementation.currentUser().setUserAttributeList(name,attributeList);
        }
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void updateMParticleCart(PluginCall call) {
        int type = call.getInt("eventType");
        JSObject product_tmp = call.getObject("productData");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        if (temp != null) {
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
        JSObject product_tmp = call.getObject("productData");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        if (temp != null) {
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
        JSObject product_tmp = call.getObject("productData");
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        if (temp != null) {
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
    public void submitPurchaseEvent(PluginCall call) throws JSONException {
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = call.getObject("customAttributes");
        if (temp != null) {
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
        }

        List<Product> productsArr = new ArrayList<>();
        JSArray products_tmp = call.getArray("productData");
        for (int i = 0; i < products_tmp.length(); i++) {
            productsArr.add(implementation.createMParticleProduct(JSObject.fromJSONObject((JSONObject) products_tmp.get(i))));
        }

        JSObject t_attributes = call.getObject("transactionAttributes");
        TransactionAttributes attributes = new TransactionAttributes(t_attributes.getString("Id"))
        .setRevenue((double) t_attributes.getInteger("Revenue"))
        .setTax((double) t_attributes.getInteger("Tax"));
        CommerceEvent event = new CommerceEvent.Builder(Product.PURCHASE, productsArr.get(0))
        .products(productsArr)
        .customAttributes(customAttributes)    
        .transactionAttributes(attributes)
        .build();
        MParticle.getInstance().logEvent(event);
    }

    @PluginMethod
    public void loginMParticleUser(PluginCall call) {
        String email = call.getString("email");
        String customerId = call.getString("customerId");
        MParticle.getInstance().Identity().login(implementation.identityRequest(email,customerId));
        long mPID = MParticle.getInstance().Identity().getCurrentUser().getId();
        JSObject jsonObject = new JSObject();
        jsonObject.put("value", mPID);
        call.resolve(jsonObject);
    }

    @PluginMethod
    public void logoutMParticleUser(PluginCall call) {
        MParticle.getInstance().Identity().logout(IdentityApiRequest.withEmptyUser().build());
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void registerMParticleUser(PluginCall call) {
        String email = call.getString("email");
        String customerId = call.getString("customerId");
        MParticle.getInstance().Identity().login(implementation.identityRequest(email,customerId))
        .addSuccessListener(new TaskSuccessListener() {
            public void onSuccess(IdentityApiResult result) {
                //proceed with login
                JSObject temp = call.getObject("userAttributes");
                if (temp != null) {
                    Iterator<String> iter = temp.keys();
                    while (iter.hasNext()) {
                        String key = iter.next();
                        try {
                            Object value = temp.get(key);
                            result.getUser().setUserAttribute(key,value);
                            } catch (JSONException e) {
                            // Something went wrong!
                        }
                    }
                }
            }
        });;
        call.resolve(new JSObject());
    }
}
