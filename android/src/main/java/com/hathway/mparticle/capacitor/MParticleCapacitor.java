package com.hathway.mparticle.capacitor;
import com.mparticle.MParticle;
import com.mparticle.MParticleOptions;
import com.mparticle.MParticle.EventType;
import com.mparticle.*;
import java.util.*;
import org.json.JSONException;

public class MParticleCapacitor {

    public String echo(String value) {
        return value;
    }

    public EventType getEventType(int ord) {
        for (EventType e : EventType.values()) {
            if (e.ordinal() == ord) {
                return e;
            }
        }
        return EventType.Other;
    }
}
