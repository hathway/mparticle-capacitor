import type { MParticleCapacitorWebConfigurationInterface } from "./mparticle-capacitor-web-configuration.interface";

const defaultConfiguration: MParticleCapacitorWebConfigurationInterface = {
  planVersion: 2,
  eventAttributesMap: {
    pageView: {
      url: "page"
    }
  },
  identityRequestAttributesMap: {
    email: {
      required: true
    },
    customerId: {
      required: true
    },
    mobile: {
      required: false
    }
  }
};

export default defaultConfiguration;