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
        } else if (key == "us1-0a82ff0dafd00d4088ebe5d4c8bcda09") {
            return "7DNQIuP16VI_f1pBSgR81CSZxVhr53V-tRLKF3hFYrUwrR5wWdFYpJ95ORAjto_l";
        } else if (key == "us1-e44ce0c8c9665c4db9f8f83647fd0fad") {
            return "lBxFCdyAY6esGXaLIE_1l79NxVVhQa-vGgUyL9zm2j4gE4GWikogzpv_tPQOfKqG";
        } else if (key == "us1-ed05ce06f30fd5409ddfdd62bb460e36") {
            return "3IQDvenyAjPgjJyZBANVehU_pBRkw2aWgmV0h9STYxYrU1lngY8sfwVr73OcDF7q";
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

    public MParticleUser currentUser() {
        return MParticle.getInstance().Identity().getCurrentUser();
    }

    public IdentityApiRequest identityRequest(String email, String customerId) {
        IdentityApiRequest identityRequest = IdentityApiRequest.withEmptyUser()
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
