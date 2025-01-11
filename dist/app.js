"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
(0, server_1.initApp)().then((app) => {
    var _a;
    const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
    app.listen(port, () => {
        console.log("Server started");
    });
});
