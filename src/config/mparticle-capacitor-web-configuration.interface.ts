export interface MParticleCapacitorWebConfigurationInterface {
  planVersion?: number;
  eventAttributesMap: {
    pageView: {
      url: string;
    },
  };
  identityRequestAttributesMap: {
    email: {
      required: boolean;
    },
    customerId: {
      required: boolean;
    },
    mobile: {
      required: boolean;
    }
  }
}