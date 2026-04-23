"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirebaseAuthAdminMiddleware", {
    enumerable: true,
    get: function() {
        return FirebaseAuthAdminMiddleware;
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
let FirebaseAuthAdminMiddleware = class FirebaseAuthAdminMiddleware {
    async use(request, response, next) {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            this.logger.warn('Token not found');
            return response.status(401).json({
                message: 'Token not found'
            });
        }
        try {
            if (token) {
                const adminResponse = await this.fireStoreService.isAdminAndVerifyToken(token);
                if (!adminResponse) {
                    this.logger.warn('Invalid admin credentials');
                    return response.status(401).json({
                        message: 'Invalid admin credentials'
                    });
                }
            }
            next();
        } catch (error) {
            if (!error.errorInfo?.message.startsWith('Firebase ID token has expired.')) {
                this.logger.error(error.errorInfo);
            }
            this.logger.warn(error.errorInfo);
            return response.status(401).json({
                message: 'Firebase ID token has expired.'
            });
        }
    }
    constructor(fireStoreService){
        this.fireStoreService = fireStoreService;
        this.logger = new _common.Logger('FirebaseAuthAdminMiddleware');
    }
};
FirebaseAuthAdminMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreservice.FirestoreService === "undefined" ? Object : _firestoreservice.FirestoreService
    ])
], FirebaseAuthAdminMiddleware);
