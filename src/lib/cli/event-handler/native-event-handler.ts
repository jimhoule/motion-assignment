import { promisify } from 'util';
import { exec } from 'node:child_process';
import { Drawer } from '../drawer/drawer';
import { EventHandler } from './event-handler';

export class NativeEventHandler implements EventHandler {
    constructor(
        private drawer: Drawer,
    ) {}

    handleHelp(): void {
        const commands = {
            exit: 'Kills the CLI and the rest of the application',
            help: 'Show this help page',
            'fetch --{accessToken}': 'Fetches info of the user related to the entered access token every 2 seconds',
        };
    
        // Shows a header of the help page that is as long as the screen
        this.drawer.drawHorizontalLine();
        this.drawer.center('CLI Manual');
        this.drawer.drawHorizontalLine()
        this.drawer.drawVerticalSpace(2);
    
        // Shows each command and its corresponding description
        for (const command in commands) {
            const description = commands[command as keyof typeof commands];
            const line = `\x1b[33m${command}\x1b[0m`;
            const padding = 60 - line.length;
            const endPaddedLine = line.padEnd(padding, ' ');
    
            console.log(`${endPaddedLine}${description}`);
            this.drawer.drawVerticalSpace(1);
        }
    
        this.drawer.drawVerticalSpace(1);
        this.drawer.drawHorizontalLine()
    }

    handleExit(): void {
        process.exit(0);
    }

    handleFetch = async (fullStringInput: string): Promise<void> => {
        const execute = promisify(exec);
        const accessToken = fullStringInput.split('--')[1];
    
        const interval = setInterval(
            async (): Promise<void> => {
                const { stdout } = await execute(`curl -i -X GET "https://graph.facebook.com/v19.0/me?access_token=${accessToken}&fields=id%2Cname%2Clast_name"`);
    
                // Gets stringify body
                const data = stdout.split('\r\n');
                const stringifyBody = data[data.length -1];
    
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
            },
            2000,
        );
    }
}