"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirebaseAuthService", {
    enumerable: true,
    get: function() {
        return FirebaseAuthService;
    }
});
const _common = require("@nestjs/common");
const _firebaseadmin = /*#__PURE__*/ _interop_require_wildcard(require("firebase-admin"));
const _firestoreservice = require("./firestore.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirebaseAuthService = class FirebaseAuthService {
    async removeUser(id) {
        let firebaseUser = null;
        try {
            await _firebaseadmin.auth().deleteUser(id);
        } catch (userFetchError) {
            console.log('resetPassowrd ERROR', userFetchError);
        }
        return firebaseUser;
    }
    async changePassword(email, password) {
        let firebaseUser = null;
        try {
            firebaseUser = await _firebaseadmin.auth().getUserByEmail(email);
            await _firebaseadmin.auth().updateUser(firebaseUser.uid, {
                ...firebaseUser,
                password
            });
        } catch (userFetchError) {
            console.log('changePassword ERROR', userFetchError);
        }
        return firebaseUser;
    }
    async registerAccount(email, password) {
        const user = await _firebaseadmin.auth().createUser({
            email,
            password
        });
        return user;
    }
    async verifyAccount(idToken) {
        return await _firebaseadmin.auth().verifyIdToken(idToken);
    }
    async sendPasswordResetEmail(email) {
        return await _firebaseadmin.auth().generatePasswordResetLink(email);
    }
    async fetchUserDetailsAndIsAdmin(req) {
        const token = this.extractToken(req);
        const [userDetails, isAdmin] = await Promise.all([
            this.verifyAccount(token),
            this.firestoreService.isAdminAndVerifyToken(token)
        ]);
        return {
            userDetails,
            isAdmin
        };
    }
    extractToken(req) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new _common.HttpException('Authorization header missing', _common.HttpStatus.UNAUTHORIZED);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new _common.HttpException('Token missing from authorization header', _common.HttpStatus.UNAUTHORIZED);
        }
        return token;
    }
    constructor(firestoreService){
        this.firestoreService = firestoreService;
        this.logger = new _common.Logger(FirebaseAuthService.name);
        this.signup = async (signupParams)=>{
            const user = await _firebaseadmin.auth().createUser({
                email: signupParams.email,
                password: signupParams.password,
                displayName: signupParams.displayName
            });
            const userInfo = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                providerId: 'api'
            };
            return userInfo;
        };
        this.getUserByEmail = async (email)=>{
            try {
                const userRecord = await _firebaseadmin.auth().getUserByEmail(email);
                return {
                    displayName: userRecord.displayName,
                    email: userRecord.email,
                    phoneNumber: userRecord.phoneNumber,
                    photoURL: userRecord.photoURL,
                    providerId: userRecord.providerData.find((p)=>p.providerId === 'password')?.providerId,
                    uid: userRecord.uid
                };
            } catch (error) {
                console.log('Error fetching user data:', error);
                return null;
            }
        };
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        };
        if (serviceAccount.projectId) {
            if (!_firebaseadmin.apps.length) {
                _firebaseadmin.initializeApp({
                    credential: _firebaseadmin.credential.cert(serviceAccount)
                });
            }
        } else {
            this.logger.warn('FIREBASE_PROJECT_ID missing, firestore disabled!');
        }
    }
};
FirebaseAuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreservice.FirestoreService === "undefined" ? Object : _firestoreservice.FirestoreService
    ])
], FirebaseAuthService);
