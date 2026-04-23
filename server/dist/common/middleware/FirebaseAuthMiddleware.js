"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirebaseAuthMiddleware", {
    enumerable: true,
    get: function() {
        return FirebaseAuthMiddleware;
    }
});
const _common = require("@nestjs/common");
const _firestoreservice = require("../../firestore/firestore.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirebaseAuthMiddleware = class FirebaseAuthMiddleware {
    async use(request, response, next) {
        const token = request.headers.authorization?.split(' ')[1];
        // Temporary disable requirement for v1
        // if (!token) {
        //   throw new UnauthorizedException('Token not found');
        // }
        try {
            if (token) {
                await this.firestoreService.verifyTokenAndOrganisations(token);
                if (request['locals']) {
                    // Not available in Login page for example
                    request['locals'].token = token; // Make token available for Controllers via @Req annotation
                }
            }
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
        this.logger = new _common.Logger('FirebaseAuthMiddleware');
    }
};
FirebaseAuthMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreservice.FirestoreService === "undefined" ? Object : _firestoreservice.FirestoreService
    ])
], FirebaseAuthMiddleware);
