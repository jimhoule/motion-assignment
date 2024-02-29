import { createInterface } from 'node:readline/promises';
import { EventEmitter } from 'node:events';
import { EventHandler } from './event-handler/event-handler';

// class Event extends EventEmitter {}

// const event = new Event();

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

// Input handlers
// event.on('help', (): void => {
//     cli.responders.help();
// });

// event.on('exit', (): void => {
//     cli.responders.exit();
// });

// event.on('fetch', (fullStringInput: string): void => {
//     cli.responders.fetch(fullStringInput);
// });

// Responder objects
// const help = (): void => {
//     const commands = {
//         exit: 'Kills the CLI and the rest of the application',
//         help: 'Show this help page',
//         'fetch --{accessToken}': 'Fetches info of the user related to the entered access token every 2 seconds',
//     };

//     // Shows a header of the help page that is as long as the screen
//     cli.horizontalLine();
//     cli.centered('CLI Manual');
//     cli.horizontalLine();
//     cli.verticalSpace(2);

//     // Shows each command and its corresponding description
//     for (const command in commands) {
//         const description = commands[command as keyof typeof commands];
//         const line = `\x1b[33m${command}\x1b[0m`;
//         const padding = 60 - line.length;
//         const endPaddedLine = line.padEnd(padding, ' ');

//         console.log(`${endPaddedLine}${description}`);
//         cli.verticalSpace(1);
//     }

//     cli.verticalSpace(1);
//     cli.horizontalLine();
// };

// const exit = (): void => {
//     process.exit(0);
// };

// const fetch = async (fullStringInput: string): Promise<void> => {
//     const execute = promisify(exec);
//     const accessToken = fullStringInput.split('--')[1];

//     const interval = setInterval(
//         async (): Promise<void> => {
//             const { stdout } = await execute(`curl -i -X GET "https://graph.facebook.com/v19.0/me?access_token=${accessToken}&fields=id%2Cname%2Clast_name"`);

//             const data = stdout.split('\r\n');
//             const stringifyBody = data[data.length -1];

//             cli.verticalSpace(1);
//             console.log(stringifyBody);
//             cli.verticalSpace(1);


//             const parsedBody = JSON.parse(stringifyBody);
//             if (!!parsedBody.error) {
//                 clearInterval(interval);

//                 if (parsedBody.code === 32) {
//                     console.log("The limit rate has been reached.");
//                 }
//             }
//         },
//         2000,
//     );
// }

// const responders = {
//     help,
//     exit,
//     fetch,
// };

// 
// const verticalSpace = (lineNumber: number): void => {
//     for (let i = 0; i < lineNumber; i++) {
//         console.log('');
//     }
// };

// const horizontalLine = (): void => {
//     // Gets the available screen width
//     const screenWidth = process.stdout.columns;
//     const line = ''.padEnd(screenWidth, '-');

//     console.log(line);
// };

// const centered = (valueToCenter: string): void => {
//     const trimmedValue = valueToCenter.trim();
//     // Gets the available screen width
//     const screenWidth = process.stdout.columns;
//     const leftPadding = Math.floor((screenWidth - trimmedValue.length) / 2);

//     console.log(trimmedValue.padStart(leftPadding, ' '));
// };

// Initializer
// const init = (): void => {
//     // Sends start message to the console in dark blue
//     console.log('\x1b[34m%s\x1b[0m', "Meta CLI");

//     // Starts the interface
//     const cliInterface = createInterface({
//         input: process.stdin,
//         output: process.stdout,
//         prompt: '',
//     });

//     // Creates an initial prompt
//     cliInterface.prompt();

//     // Handles eahc line of input separatly
//     cliInterface.on('line', (input: string): void => {
//         // Sends to the input processor
//         cli.processInput(input);

//         // Reinitializes prompt afterwards
//         cliInterface.prompt();
//     });

//     // Kills th associated process if user stops the CLI
//     cliInterface.on('close', (): void => {
//         process.exit();
//     })
// };

// Input processor
// const processInput = (input: string): void => {
//     const fullStringInput = typeof(input) === 'string' && input.trim().length > 0 ? input.trim() : '';

//     // Processes the input only if user wrote something
//     if (!fullStringInput) {
//         console.log('You must enter a string.');
//         return;
//     }
    
//     const uniqueInputs = ['help', 'exit', 'fetch'];
//     const wasFound = uniqueInputs.some((uniqueInput: string): boolean => {
//         const isEqual = fullStringInput.split(' ')[0] === uniqueInput;

//         if (isEqual) {
//             event.emit(uniqueInput, fullStringInput);
//         }

//         return isEqual;
//     });

//     if (!wasFound) {
//         console.log('Option not found.');
//         return;
//     }
// };

// export const cli = {
//     responders,
//     init,
//     processInput,
//     horizontalLine,
//     verticalSpace,
//     centered,
// };