"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleCloudAuthMiddleware", {
    enumerable: true,
    get: function() {
        return GoogleCloudAuthMiddleware;
    }
});
const _common = require("@nestjs/common");
const _firestoreservice = require("../../firestore/firestore.service");
const _googleauthlibrary = require("google-auth-library");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GoogleCloudAuthMiddleware = class GoogleCloudAuthMiddleware {
    async verifyCloudSchedulerToken(token, audience) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token
            });
            const payload = ticket.getPayload();
            this.logger.log(JSON.stringify(payload, null, 4));
            // Verify the token was issued for your service account
            // if (
            //   payload['email'] !==
            //   'your-service-account@your-project.iam.gserviceaccount.com'
            // ) {
            //   throw new Error('Token not issued for the expected service account');
            // }
            // Verify the token hasn't expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTime) {
                throw new Error('Token has expired');
            }
            // If we get here, the token is valid
            this.logger.log('Token verified successfully');
            return payload;
        } catch (error) {
            this.logger.error('Token verification failed:', error.message);
            throw error;
        }
    }
    async use(request, response, next) {
        this.logger.log(request.headers.authorization);
        try {
            const token = request.headers.authorization?.split(' ')[1];
            const audience = 'https://your-cloud-run-service-url';
            await this.verifyCloudSchedulerToken(token, audience);
            next();
        } catch (error) {
            if (!error.errorInfo?.message.startsWith('Firebase ID token has expired.')) {
                this.logger.error(error.errorInfo ?? error);
            }
            this.logger.warn(error.errorInfo ?? error);
            // Temporary
            next();
        // throw new UnauthorizedException('Invalid token');
        }
    }
    constructor(firestoreService){
        this.firestoreService = firestoreService;
        this.logger = new _common.Logger(GoogleCloudAuthMiddleware.name);
        this.client = new _googleauthlibrary.OAuth2Client();
    }
};
GoogleCloudAuthMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreservice.FirestoreService === "undefined" ? Object : _firestoreservice.FirestoreService
    ])
], GoogleCloudAuthMiddleware);
