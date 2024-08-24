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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const DB_1 = __importDefault(require("./app/DB"));
require("dotenv").config();
let server;
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url); // remote mongodb
            // await mongoose.connect("mongodb://localhost:27017/phuniversity"); // local mongodb
            console.log("Database Connected!");
            (0, DB_1.default)();
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Server listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log("Error while connecting server and database");
        }
    });
}
// unhandled rejection
process.on("unhandledRejection", () => {
    console.log("unhandledRejection is detected, shutting down the server");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// uncaught exception
process.on("uncaughtException", () => {
    console.log("uncaught exception is detected");
    process.exit(1);
});
