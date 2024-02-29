"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cli = void 0;
const promises_1 = require("node:readline/promises");
class Cli {
    constructor(eventEmitter, eventHandler) {
        this.eventEmitter = eventEmitter;
        this.eventHandler = eventHandler;
        // Inits all event handlers
        this.eventEmitter.on('help', () => {
            this.eventHandler.handleHelp();
        });
        this.eventEmitter.on('exit', () => {
            this.eventHandler.handleExit();
        });
        this.eventEmitter.on('fetch', (fullStringInput) => {
            this.eventHandler.handleFetch(fullStringInput);
        });
    }
    init() {
        // Sends start message to the console in dark blue
        console.log('\x1b[34m%s\x1b[0m', "Meta CLI");
        // Starts the interface
        const cliInterface = (0, promises_1.createInterface)({
            input: process.stdin,
            output: process.stdout,
            prompt: '',
        });
        // Creates an initial prompt
        cliInterface.prompt();
        // Handles each line of input separatly
        cliInterface.on('line', (input) => {
            // Sends to the input processor
            this.processInput(input);
            // Reinitializes prompt afterwards
            cliInterface.prompt();
        });
        // Kills th associated process if user stops the CLI
        cliInterface.on('close', () => {
            process.exit();
        });
    }
    processInput(input) {
        const fullStringInput = typeof (input) === 'string' && input.trim().length > 0 ? input.trim() : '';
        // Processes the input only if user wrote something
        if (!fullStringInput) {
            console.log('You must enter a string.');
            return;
        }
        const uniqueInputs = ['help', 'exit', 'fetch'];
        const wasFound = uniqueInputs.some((uniqueInput) => {
            const isEqual = fullStringInput.split(' ')[0] === uniqueInput;
            if (isEqual) {
                this.eventEmitter.emit(uniqueInput, fullStringInput);
            }
            return isEqual;
        });
        if (!wasFound) {
            console.log('Option not found.');
            return;
        }
    }
}
exports.Cli = Cli;
