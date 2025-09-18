"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const validation_1 = require("./validation");
const apiHandler_1 = require("../../../lib/apiHandler");
const user_1 = require("../../../packages/user");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/", (0, apiHandler_1.apiHandler)(async (req) => {
    const { body } = await (0, apiHandler_1.zParse)(validation_1.createUserSchema, req);
    return await (0, user_1.createUser)(body);
}));
exports.userRouter.get("/:id", (0, apiHandler_1.apiHandler)(async (req) => {
    const { params } = await (0, apiHandler_1.zParse)(validation_1.getUserByIdSchema, req);
    return await (0, user_1.getUserById)(params.id);
}));
