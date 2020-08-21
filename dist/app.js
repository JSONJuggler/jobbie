"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(express_1.default.json());
//Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express_1.default.static(path_1.default.join(__dirname, "client", "build")));
    // Serve index.html on all routes except any api routes above
    app.get("*", function (req, res) {
        res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html"));
    });
}
