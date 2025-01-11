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
exports.authMiddleware = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function sendError(res, msg) {
    res.status(400).send({
        status: "fail",
        massage: msg,
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Register function called");
    const { userName, email, password } = req.body;
    if (!email || !password) {
        return sendError(res, "email and password are required");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user != null) {
            return sendError(res, "user already exists");
        }
    }
    catch (err) {
        return sendError(res, "error in finding user");
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = new user_model_1.default({
            userName: userName,
            email: email,
            password: encryptedPassword,
        });
        const newUser = yield user.save();
        res.status(200).send(newUser);
    }
    catch (err) {
        return sendError(res, "failed registering user");
    }
});
const generateTokens = (_id) => {
    const random = Math.floor(Math.random() * 1000000);
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    const accessToken = jsonwebtoken_1.default.sign({
        _id: _id,
        random: random,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: _id,
        random: random,
    }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login function called");
    const { userName, email, password } = req.body;
    if (!email || !password) {
        return sendError(res, "email or password are worng");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return sendError(res, "email or password are worng");
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return sendError(res, "email or password are worng");
        }
        const userId = user._id.toString();
        const tokens = generateTokens(userId);
        if (!tokens) {
            res.status(400).send("missing auth configuration");
            return;
        }
        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            userName: user.userName,
            email: user.email,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
    catch (err) {
        res.status(400);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Logout function called");
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("missing refresh token");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(403).send("invalid token");
            return;
        }
        const payload = data;
        try {
            const user = yield user_model_1.default.findById({ _id: payload._id });
            if (!user) {
                res.status(400).send("user not found");
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                res.status(400).send("invalid refresh token");
                user.refreshTokens = [];
                yield user.save();
                return;
            }
            const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens = tokens;
            yield user.save();
            res.status(200).send("logged out");
        }
        catch (err) {
            res.status(400).send("invalid token");
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //first validate the refresh token
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("invalid token");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(403).send("invalid token");
            return;
        }
        //find the user
        const payload = data;
        try {
            const user = yield user_model_1.default.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("invalid token");
                return;
            }
            //check that the token exists in the user
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                yield user.save();
                res.status(400).send("invalid token");
                return;
            }
            //generate a new access token
            const newTokens = generateTokens(user._id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                yield user.save();
                res.status(400).send("missing auth configuration");
                return;
            }
            //delete the old refresh token
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            //save the new refresh token in the user
            user.refreshTokens.push(newTokens.refreshToken);
            yield user.save();
            //return the new access token and the new refresh token
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        }
        catch (err) {
            res.status(400).send("invalid token");
        }
    }));
});
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).send("missing token");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send("missing auth configuration");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            res.status(403).send("invalid token");
            return;
        }
        const payload = data;
        req.query.userId = payload._id;
        next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = {
    refresh,
    login,
    register,
    logout,
};
