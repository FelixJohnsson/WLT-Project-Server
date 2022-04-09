"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const send = {
    success: (res, data) => {
        res.status(200).send(data);
    },
    error: (res, data) => {
        res.status(400).send(data);
    },
    warning: (res, data) => {
        res.status(400).send(data);
    },
    info: (res, data) => {
        res.status(400).send(data);
    },
    notFound: (res, data) => {
        res.status(404).send(data);
    },
};
exports.default = send;
