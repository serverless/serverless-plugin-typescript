"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
const _ = require("lodash");
// modern module syntax
function hello(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        // dependencies work as expected
        console.log(_.VERSION);
        // async/await also works out of the box
        yield new Promise((resolve, reject) => setTimeout(resolve, 500));
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            }),
        };
        callback(null, response);
    });
}
exports.hello = hello;
//# sourceMappingURL=handler.js.map