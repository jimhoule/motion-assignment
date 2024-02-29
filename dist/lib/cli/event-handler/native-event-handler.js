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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeEventHandler = void 0;
const util_1 = require("util");
const node_child_process_1 = require("node:child_process");
class NativeEventHandler {
    constructor(drawer) {
        this.drawer = drawer;
        this.handleFetch = (fullStringInput) => __awaiter(this, void 0, void 0, function* () {
            const execute = (0, util_1.promisify)(node_child_process_1.exec);
            const accessToken = fullStringInput.split('--')[1];
            const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const { stdout } = yield execute(`curl -i -X GET "https://graph.facebook.com/v19.0/me?access_token=${accessToken}&fields=id%2Cname%2Clast_name"`);
                // Gets stringify body
                const data = stdout.split('\r\n');
                const stringifyBody = data[data.length - 1];
                // Prints stringify body
                this.drawer.drawVerticalSpace(1);
                console.log(stringifyBody);
                this.drawer.drawVerticalSpace(1);
                // Handles errors
                const parsedBody = JSON.parse(stringifyBody);
                if (!!parsedBody.error) {
                    clearInterval(interval);
                    if (parsedBody.code === 32) {
                        console.log("The limit rate has been reached.");
                    }
                }
            }), 2000);
        });
    }
    handleHelp() {
        const commands = {
            exit: 'Kills the CLI and the rest of the application',
            help: 'Show this help page',
            'fetch --{accessToken}': 'Fetches info of the user related to the entered access token every 2 seconds',
        };
        // Shows a header of the help page that is as long as the screen
        this.drawer.drawHorizontalLine();
        this.drawer.center('CLI Manual');
        this.drawer.drawHorizontalLine();
        this.drawer.drawVerticalSpace(2);
        // Shows each command and its corresponding description
        for (const command in commands) {
            const description = commands[command];
            const line = `\x1b[33m${command}\x1b[0m`;
            const padding = 60 - line.length;
            const endPaddedLine = line.padEnd(padding, ' ');
            console.log(`${endPaddedLine}${description}`);
            this.drawer.drawVerticalSpace(1);
        }
        this.drawer.drawVerticalSpace(1);
        this.drawer.drawHorizontalLine();
    }
    handleExit() {
        process.exit(0);
    }
}
exports.NativeEventHandler = NativeEventHandler;
