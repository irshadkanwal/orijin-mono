"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return FirebaseStorageProvider;
    }
});
const _firebaseadmin = /*#__PURE__*/ _interop_require_wildcard(require("firebase-admin"));
const _uuid = require("uuid");
const _common = require("@nestjs/common");
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
let FirebaseStorageProvider = class FirebaseStorageProvider {
    uploadDocument(path, file, // eslint-disable-next-line @typescript-eslint/ban-types
    stateChangeCallback) {
        throw new Error('Method not implemented.');
    }
    uploadImg(filePath, buffer, contentType) {
        throw new Error('Method not implemented.');
    }
    constructor(app, bucket){
        this.uploadJSONFile = async (path, json, // eslint-disable-next-line @typescript-eslint/ban-types
        stateChangeCallback)=>{
            const file = this.bucket.file(path);
            await file.save(JSON.stringify(json), {
                contentType: 'application/json',
                metadata: {
                    firebaseStorageDownloadTokens: (0, _uuid.v4)()
                }
            });
            return this.getPublicUrl(path);
        };
        this.getPublicUrl = (fullPath)=>{
            return `https://storage.googleapis.com/${this.bucket.name}/${fullPath}`;
        };
        this.uploadHTMLReport = async (path, html, // eslint-disable-next-line @typescript-eslint/ban-types
        stateChangeCallback)=>{
            try {
                const file = this.bucket.file(path);
                await file.save(html, {
                    contentType: 'text/html',
                    metadata: {
                        firebaseStorageDownloadTokens: (0, _uuid.v4)()
                    }
                });
                const doc = {
                    storagePath: path,
                    publicUrl: this.getPublicUrl(path),
                    url: this.getPublicUrl(path)
                };
                return doc;
            } catch (e) {
                console.log('Error in uploadHTMLReport', e);
                throw e;
            }
        };
        this.uploadFile = async (path, file, // eslint-disable-next-line @typescript-eslint/ban-types
        stateChangeCallback)=>{
            const fileRef = this.bucket.file(path);
            await fileRef.save(file, {
                contentType: file.type,
                metadata: {
                    firebaseStorageDownloadTokens: (0, _uuid.v4)()
                }
            });
            return this.getPublicUrl(path);
        };
        this.uploadDocumentFromBase64 = async (path, file)=>{
            if (file.data) {
                const image = file.data;
                // let mimeType = file.data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
                // let fileName = path + mimeTypes.detectExtension(mimeType)
                const fileRef = this.bucket.file(path + file.originalUploadName);
                // let base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '')
                // let base64EncodedImageString = image.replace(/^data:\/\w+;base64,/, '')
                const base64EncodedImageString = image.split(',').pop();
                const imageBuffer = new Buffer(base64EncodedImageString, 'base64');
                await fileRef.save(imageBuffer, {
                    contentType: file.mimeType,
                    metadata: {
                        firebaseStorageDownloadTokens: (0, _uuid.v4)()
                    }
                });
                const doc = {
                    size: file.size,
                    name: file.name,
                    type: file.type,
                    storagePath: fileRef.cloudStorageURI.toString(),
                    publicUrl: fileRef.publicUrl(),
                    url: fileRef.baseUrl
                };
                return doc;
            }
            throw Error('file is empty');
        };
        // eslint-disable-next-line @typescript-eslint/ban-types
        this.deleteFile = async (path, stateChangeCallback)=>{
            try {
                console.log('Deleting file ' + path);
                const fileRef = this.bucket.file(path);
                await fileRef.delete();
            } catch (e) {
                console.log('Problem with delete', e);
                throw e;
            }
        };
        this.getDownloadUrl = async (path)=>{
            return this.getPublicUrl(path);
        };
        this.storage = _firebaseadmin.storage(app);
        this.bucket = this.storage.bucket(bucket);
    }
};
FirebaseStorageProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firebaseadmin === "undefined" || typeof _firebaseadmin.app === "undefined" || typeof _firebaseadmin.app.App === "undefined" ? Object : _firebaseadmin.app.App,
        String
    ])
], FirebaseStorageProvider);
