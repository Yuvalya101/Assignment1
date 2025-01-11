"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const users_routes_1 = __importDefault(require("./routes/users_routes"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const app = (0, express_1.default)();
    if (process.env.NODE_ENV == "development") {
        const options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "Web Dev 2022 REST API",
                    version: "1.0.0",
                    description: "REST server including authentication using JWT",
                },
                servers: [{ url: "http://localhost:3000", },],
            },
            apis: ["./src/routes/*.ts"],
        };
        const specs = (0, swagger_jsdoc_1.default)(options);
        app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    }
    mongoose_1.default.connection.on("error", console.error.bind(console, "connection error:"));
    mongoose_1.default.connection.on("open", function () {
        console.log("connected to the database");
    });
    yield mongoose_1.default.connect((_a = process.env.DB_CONNECT) !== null && _a !== void 0 ? _a : "127.0.0.1:27017");
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/posts", posts_routes_1.default);
    app.use("/comments", comments_routes_1.default);
    app.use("/users", users_routes_1.default);
    app.use("/auth", auth_routes_1.default);
    return app;
});
exports.initApp = initApp;
