import { createInterface } from 'node:readline/promises';
import { EventEmitter } from 'node:events';
import { EventHandler } from './event-handler/event-handler';

export class Cli {
    constructor(
        private eventEmitter: EventEmitter,
        private eventHandler: EventHandler,
    ) {
        // Inits all event handlers
        this.eventEmitter.on('help', (): void => {
            this.eventHandler.handleHelp();
        });
        
        this.eventEmitter.on('exit', (): void => {
            this.eventHandler.handleExit();
        });
        
        this.eventEmitter.on('fetch', (fullStringInput: string): void => {
            this.eventHandler.handleFetch(fullStringInput);
        });
    }

    init(): void {
        // Sends start message to the console in dark blue
        console.log('\x1b[34m%s\x1b[0m', "Meta CLI");
    
        // Starts the interface
        const cliInterface = createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '',
        });
    
        // Creates an initial prompt
        cliInterface.prompt();
    
        // Handles each line of input separatly
        cliInterface.on('line', (input: string): void => {
            // Sends to the input processor
            this.processInput(input);
    
            // Reinitializes prompt afterwards
            cliInterface.prompt();
        });
    
        // Kills th associated process if user stops the CLI
        cliInterface.on('close', (): void => {
            process.exit();
        })
    }

    private processInput(input: string): void {
        const fullStringInput = typeof(input) === 'string' && input.trim().length > 0 ? input.trim() : '';
    
        // Processes the input only if user wrote something
        if (!fullStringInput) {
            console.log('You must enter a string.');
            return;
        }
        
        const uniqueInputs = ['help', 'exit', 'fetch'];
        const wasFound = uniqueInputs.some((uniqueInput: string): boolean => {
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