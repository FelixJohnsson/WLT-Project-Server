"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const print = {
    success: (message) => {
        console.log(chalk_1.default.white.bgGreen(message));
    },
    error: (message) => {
        console.log(chalk_1.default.white.bgRed(message));
    },
    warning: (message) => {
        console.log(chalk_1.default.white.bgYellow(message));
    },
    info: (message) => {
        console.log(chalk_1.default.white.bgBlue(message));
    },
    debug: (message) => {
        console.log(chalk_1.default.white.bgMagenta(message));
    },
    log: (message) => {
        console.log(chalk_1.default.white.bgBlack(message));
    },
};
exports.default = print;
