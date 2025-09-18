"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiHandler = apiHandler;
exports.zParse = zParse;
const zod_1 = require("zod");
const error_1 = require("./error");
function apiHandler(fn) {
    return async function (req, res, next) {
        try {
            const data = await fn(req, res, next);
            if (data) {
                switch (req.method) {
                    case "POST":
                        res.status(201).send({
                            data: data,
                        });
                        break;
                    default:
                        res.status(200).send({
                            data: data,
                        });
                        break;
                }
            }
            else {
                switch (req.method) {
                    case "POST":
                        res.status(201).send();
                        break;
                    case "GET":
                        console.log("404 error in API Route: ", req.originalUrl);
                        res.status(404).send("Resource doesnt exist");
                        break;
                    case "PUT":
                        res.status(204).send();
                        break;
                    case "DELETE":
                        res.status(204).send();
                        break;
                    default:
                        res.status(200).send();
                }
            }
        }
        catch (err) {
            if (err instanceof error_1.ValidationError) {
                console.log("400 error in API Route: ", req.originalUrl, err.format());
                res.status(400).json(err.format());
            }
            else if (err instanceof error_1.ZodValidationError) {
                console.log("400 error in API Route: ", req.originalUrl, err.format());
                res.status(400).json(err.format());
            }
            else if (err instanceof error_1.UnauthorizedError) {
                console.log("401 error in API Route: ", req.originalUrl, err.format());
                res.status(401).json(err.format());
            }
            else if (err instanceof error_1.NotFoundError) {
                console.log("404 error in API Route: ", req.originalUrl, err.format());
                res.status(404).json(err.format());
            }
            else {
                console.log("Error in API Route: ", req.originalUrl, err, req.body, req.params);
                res.status(500).send({
                    message: `Internal server error: ${err.message}`,
                });
            }
        }
    };
}
async function zParse(schema, req) {
    try {
        return await schema.parseAsync(req);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new error_1.ZodValidationError(error);
        }
        throw error;
    }
}
