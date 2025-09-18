"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ZodValidationError = exports.ValidationError = exports.UnauthorizedError = void 0;
exports.handleErrors = handleErrors;
const ts_custom_error_1 = require("ts-custom-error");
function handleErrors(error, res) {
    if (error instanceof ZodValidationError) {
        return res.status(400).json(error.format());
    }
    if (error instanceof ValidationError) {
        const err = error.format();
        return res.status(400).json(err);
    }
    return res.status(500).json({ message: "Internal server error." });
}
class UnauthorizedError extends ts_custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
    }
    format() {
        return {
            message: this.message,
        };
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ValidationError extends ts_custom_error_1.CustomError {
    constructor(object, field, message, data) {
        super(message);
        this.object = object;
        this.field = field;
        this.data = data;
    }
    format() {
        return {
            object: this.object,
            field: this.field,
            message: this.message,
            data: this.data,
        };
    }
}
exports.ValidationError = ValidationError;
class ZodValidationError extends ts_custom_error_1.CustomError {
    constructor(zodErrors) {
        super("Validation failed");
        this.errors = zodErrors.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
        }));
    }
    format() {
        return {
            message: this.message,
            errors: this.errors,
        };
    }
}
exports.ZodValidationError = ZodValidationError;
class NotFoundError extends ts_custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
    }
    format() {
        return {
            message: this.message,
        };
    }
}
exports.NotFoundError = NotFoundError;
