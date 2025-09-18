"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)().min(1, "Name is required"),
        email: (0, zod_1.string)().email("Invalid email"),
        password: (0, zod_1.string)()
            .min(8, "Password must be at least 8 characters long")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    }).strict(),
});
exports.getUserByIdSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)().uuid("Invalid user ID"),
    }),
});
