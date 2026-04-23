export default class GoogleApiCredential {
  public accessToken: string = null;
  public refreshToken: string = null;
  public scope: string = null;
  public expiryDate: Date = null;
  public idToken: string = null;

  constructor(
    accessToken: string,
    refreshToken: string,
    expiryDate: Date,
    idToken: string,
    scope: string,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.scope = scope;
    this.expiryDate = expiryDate;
    this.idToken = idToken;
  }
}
