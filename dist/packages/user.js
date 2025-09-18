"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.createUser = void 0;
const error_1 = require("../lib/error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const createUser = async (body) => {
    const { name, email, password } = body;
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new error_1.ValidationError("User", "Conflict", "Email already in use");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.prisma.user.create({
            data: { name, email, passwordHash },
        });
        return { id: newUser.id, name: newUser.name, email: newUser.email };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new error_1.ValidationError("User", error.name, error.message);
        }
        throw new error_1.ValidationError("User", "UnknownError", "An unknown error occurred.");
    }
};
exports.createUser = createUser;
const getUserById = async (id) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new error_1.ValidationError("User", "NotFound", "User not found");
        }
        return { id: user.id, name: user.name, email: user.email };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new error_1.ValidationError("User", error.name, error.message);
        }
        throw new error_1.ValidationError("User", "UnknownError", "An unknown error occurred.");
    }
};
exports.getUserById = getUserById;
