export type mParticleInitListener = (info:any) => any;

export interface MParticleCapacitorPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;

  mParticleInit(call:any): Promise<any>;

  logMParticleEvent(call:any): Promise<any>;
  logMParticlePageView(call:any): Promise<any>;

  setUserAttribute(call:any): Promise<any>;
  setUserAttributeList(call:any): Promise<any>;

  updateMParticleCart(call:any): Promise<any>;
  addMParticleProduct(call:any): Promise<any>;
  removeMParticleProduct(call:any): Promise<any>;

  submitPurchaseEvent(call:any): Promise<any>;

  loginMParticleUser(call:any): Promise<any>;
  logoutMParticleUser(call?:any): Promise<any>;
  registerMParticleUser(call:any): Promise<any>;
}

export enum MParticleEventType {
  Navigation = 1,
  Location = 2,
  Search = 3,
  Transaction = 4,
  UserContent = 5,
  UserPreference = 6,
  Social = 7,
  Other = 8
}

export enum MParticleProductActionType {
  Unknown = 0,
  AddToCart = 1,
  RemoveFromCart = 2,
  Checkout = 3,
  CheckoutOption = 4,
  Click = 5,
  ViewDetail = 6,
  Purchase = 7,
  Refund = 8,
  AddToWishlist = 9,
  RemoveFromWishlist = 10,
}
