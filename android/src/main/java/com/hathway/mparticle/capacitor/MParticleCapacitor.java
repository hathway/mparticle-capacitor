package com.hathway.mparticle.capacitor;
import java.util.Dictionary;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import com.mparticle.MParticle;
import com.mparticle.MParticleOptions;
import com.mparticle.MParticle.EventType;
import com.mparticle.identity.MParticleUser;
import com.mparticle.identity.IdentityApiRequest;
import com.mparticle.commerce.Product;
import com.mparticle.commerce.Product.Builder;
// import com.mparticle.*;
import java.util.*;
import org.json.JSONException;

public class MParticleCapacitor {

    public String echo(String value) {
        return value;
    }

    public String getSecret(String key) {
        if (key == "us1-8c8c91aa9ec62c46bb6d33502d11bac1") {
            return "BCBZ7JzoS5i_mVmiWWsq12JspNQt_tF7G5iiNgIT4FJXO1kwGlB6rvgRRtDbPOc2";
        }
        return "";
    }

    public EventType getEventType(int ord) {
        for (EventType e : EventType.values()) {
            if (e.ordinal() == ord) {
                return e;
            }
        }
        return EventType.Other;
    }

    public String getProductEventType(int ord) {
        if (ord == 1) {
            return Product.ADD_TO_CART;
        } else if (ord == 2) {
            return Product.REMOVE_FROM_CART;
        } else {
            return Product.CLICK;
        }
    }

    public List<JSObject> toList(JSArray array) throws JSONException {
        List<JSObject> items = new ArrayList<>();
//        Object o = null;
        for (int i = 0; i < array.length(); i++) {
//            o = array.get(i);
            try {
                items.add((JSObject) (array.get(i)));
            } catch (Exception ex) {
                throw new JSONException("Not all items are instances of the given type");
            }
        }
        return items;
    }

    public MParticleUser currentUser() {
        return MParticle.getInstance().Identity().getCurrentUser();
    }

    public IdentityApiRequest identityRequest(String email, String customerId) {
        IdentityApiRequest identityRequest = IdentityApiRequest.withEmptyUser()
        //the IdentityApiRequest provides several convenience methods for common identity types
        .email(email)
        .customerId(customerId)
        .build();
        return identityRequest;
    }

    public Product createMParticleProduct(JSObject productData) {
        Map<String, String> customAttributes = new HashMap<String, String>();
        JSObject temp = productData.getJSObject("attributes");
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
        return new Product.Builder(
            (String) productData.getString("name"),
            (String) productData.getString("sku"),
            (double) productData.getInteger("cost"))
            .quantity((double) productData.getInteger("quantity"))
            .customAttributes((Map<String,String>) customAttributes)
            .build();
    }
}
