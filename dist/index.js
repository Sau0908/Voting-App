"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const user_1 = require("./api/routes/user");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.get("/health", async (req, res) => {
    try {
        const dbResponse = await prisma.$queryRaw `SELECT version()`;
        console.log("Database response:", dbResponse);
        res.json({ status: "OK", db: dbResponse });
    }
    catch (error) {
        res.status(500).json({ status: "ERROR", error });
    }
});
app.use("/user", user_1.userRouter);
app.listen(port, () => {
    console.log(`Server ready at: http://localhost:${port}`);
});
