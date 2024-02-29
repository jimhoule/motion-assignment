import { Drawer } from './drawer';

export class NativeDrawer implements Drawer {
    drawVerticalSpace(lineNumber: number): void {
        for (let i = 0; i < lineNumber; i++) {
            console.log('');
        }
    }
    
    drawHorizontalLine(): void {
        // Gets the available screen width
        const screenWidth = process.stdout.columns;
        const line = ''.padEnd(screenWidth, '-');
    
        console.log(line);
    };
    
    center(valueToCenter: string): void {
        const trimmedValue = valueToCenter.trim();
        // Gets the available screen width
        const screenWidth = process.stdout.columns;
        const leftPadding = Math.floor((screenWidth - trimmedValue.length) / 2);
    
        console.log(trimmedValue.padStart(leftPadding, ' '));
    };
}