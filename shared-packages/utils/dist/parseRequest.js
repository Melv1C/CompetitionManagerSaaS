"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRequest = void 0;
const zod_1 = require("zod");
const parseRequest = (key, schema) => (req, res, next) => {
    try {
        req[key] = schema.parse(req[key]);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            console.log(error);
            res.status(400).send(error.errors);
        }
        else {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};
exports.parseRequest = parseRequest;
