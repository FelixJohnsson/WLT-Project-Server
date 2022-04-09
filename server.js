"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const print_1 = __importDefault(require("./print"));
const resSend_1 = __importDefault(require("./resSend"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    resSend_1.default.notFound(res, { message: 'Not found' });
});
app.listen(port, () => print_1.default.success(`Example app listening on port ${port}`));
