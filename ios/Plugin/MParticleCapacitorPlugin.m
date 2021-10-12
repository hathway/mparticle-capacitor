#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(MParticleCapacitorPlugin, "MParticleCapacitor",
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logMParticleEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(mParticleInit, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(application, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logMParticleEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logMParticlePageView, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserAttribute, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserAttributeList, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(loginMParticleUser, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(loginMParticleUser, CAPPluginReturnPromise);
)
