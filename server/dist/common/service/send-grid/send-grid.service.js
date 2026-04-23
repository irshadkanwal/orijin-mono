// sendgrid.service.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SendGridService", {
    enumerable: true,
    get: function() {
        return SendGridService;
    }
});
const _common = require("@nestjs/common");
const _mail = /*#__PURE__*/ _interop_require_default(require("@sendgrid/mail"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
let SendGridService = class SendGridService {
    async sendMail(to, subject, text, html, data) {
        _mail.default.setApiKey(this.apiKey);
        const fromEmail = process.env.SENDGRID_SENDER_EMAIL;
        if (!fromEmail) {
            throw new Error('SENDGRID_SENDER_EMAIL not found in environment variables.');
        }
        const msg = {
            to,
            from: fromEmail,
            subject
        };
        if (text) {
            msg.text = text;
        }
        if (html) {
            msg.html = html;
        }
        if (data) {
            const templateId = process.env.SENDGRID_EMAIL_TEMPLATE_ID;
            if (!templateId) {
                throw new Error('SENDGRID_EMAIL_TEMPLATE_ID not found in environment variables.');
            }
            msg.templateId = templateId;
            msg.dynamic_template_data = {
                ...data,
                subject
            };
        }
        try {
            await _mail.default.send(msg);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response) {
                console.error('Error response body:', error.response.body);
                throw new Error(error.response.body.errors[0]?.message || 'Error sending email');
            }
            throw new Error('Unknown error sending email');
        }
    }
    constructor(){
        this.logger = new _common.Logger(SendGridService.name);
        this.apiKey = process.env.SENDGRID_API_KEY;
        if (!this.apiKey) {
            if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'ci') {
                this.logger.error('SENDGRID_API_KEY not found in environment variables.');
            }
            return;
        }
    }
};
SendGridService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], SendGridService);
