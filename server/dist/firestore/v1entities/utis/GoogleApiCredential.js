"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return GoogleApiCredential;
    }
});
let GoogleApiCredential = class GoogleApiCredential {
    constructor(accessToken, refreshToken, expiryDate, idToken, scope){
        this.accessToken = null;
        this.refreshToken = null;
        this.scope = null;
        this.expiryDate = null;
        this.idToken = null;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.scope = scope;
        this.expiryDate = expiryDate;
        this.idToken = idToken;
    }
};
