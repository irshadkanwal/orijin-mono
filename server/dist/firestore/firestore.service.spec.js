"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _chance = require("chance");
const _firestoreservice = require("./firestore.service");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _config1 = /*#__PURE__*/ _interop_require_default(require("../common/configs/config"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const chance = new _chance.Chance();
describe('Firestore', ()=>{
    let firestoreService;
    beforeEach(async ()=>{
        const app = await _testing.Test.createTestingModule({
            imports: [
                _config.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [
                        _config1.default
                    ]
                })
            ],
            providers: [
                _config.ConfigService,
                _firestoreservice.FirestoreService
            ]
        }).compile();
        app.useLogger(new _common.Logger());
        firestoreService = app.get(_firestoreservice.FirestoreService);
    });
    /**
   * WARN: Live firestore connection! From your .env!
   *
   * Keep as ".skip" in git!
   */ describe.skip('Connect to firestore', ()=>{
        it('should return "Hello World!"', async ()=>{
            const result = await firestoreService.importFromFirestore('');
            expect(result).toEqual(2);
        // expect(await farmCollection.get()).toEqual({});
        });
    });
});
