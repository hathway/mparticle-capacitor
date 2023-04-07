import { describe, it, beforeEach, vi } from 'vitest'

import { MParticleCapacitorWeb } from "./web";

const mockMParticle = {
  init: vi.fn().mockImplementation((_, mParticleConfig) => mParticleConfig.identityCallback()),
  logPageView: vi.fn(),
  Identity: {
    login: vi.fn().mockImplementation((_, callback) => {
      callback();
    }),
    logout: vi.fn().mockImplementation((_, callback) => {
      callback();
    }),
  },
};

describe.concurrent('MParticleCapacitorWeb', () => {
  let mp;
  const key = "";
  const mParticleConfig = {
    isDevelopmentMode: true,
    planID: "test_app",
    logLevel: "verbose",
  };
  beforeEach(() => {
    mp = new MParticleCapacitorWeb();
    mp.mParticle = mockMParticle;
  });

  it.concurrent('builds configuration with default plan version when plan version not passed and plan version is required', async (expect) => {
    const config = await mp.mParticleConfig({
      ...mParticleConfig,
      planVersionRequired: true,
    });
    expect.expect(config.dataPlan.planVersion).toEqual(2);
  });

  it.concurrent('builds configuration without plan version when plan version not passed and plan version is not required', async (expect) => {
    const config = await mp.mParticleConfig({
      ...mParticleConfig,
      planVersionRequired: false,
    });
    expect.expect(config.dataPlan.planVersion).toBeUndefined();
  });

  it.concurrent('logs the user into mParticle', async (expect) => {
    const email = 'testuser@bounteous.com';
    const customerId = 123456;
    const loginMparticleUser = vi.spyOn(mp.mParticle.Identity, "login");
    await mp.mParticleInit({key, mParticleConfig});
    await mp.loginMParticleUser({email, customerId});
    expect.expect(loginMparticleUser).toHaveBeenCalledOnce();
  });

  it.concurrent('logs the user out of mParticle', async (expect) => {
    const logoutMparticleUser = vi.spyOn(mp.mParticle.Identity, "logout");
    await mp.mParticleInit({key, mParticleConfig});
    await mp.logoutMParticleUser();
    expect.expect(logoutMparticleUser).toHaveBeenCalledOnce();
  });

  it.concurrent('sends pageView event url with attribute name "page" when no override is passed', async (expect) => {
    const call = {
      pageName: "test page",
      pageLink: "www.test.com",
    };
    await mp.mParticleInit({key, mParticleConfig});
    const logMParticlePageView = vi.spyOn(mp.mParticle, "logPageView");
    mp.logMParticlePageView(call);
    expect.expect(logMParticlePageView).toBeCalledWith(call.pageName, {page: call.pageLink});
  });

  it.concurrent('sends pageView event url with specified attribute name when override is passed', async (expect) => {
    const call = {
      pageName: "test page",
      pageLink: "www.test.com",
      overrides: {
        attributeName: "testAttr"
      }
    };
    await mp.mParticleInit({key, mParticleConfig});
    const logMParticlePageView = vi.spyOn(mp.mParticle, "logPageView");
    mp.logMParticlePageView(call);
    expect.expect(logMParticlePageView).toBeCalledWith(call.pageName, {[call.overrides.attributeName]: call.pageLink});
  });
})