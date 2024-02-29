"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeDrawer = void 0;
class NativeDrawer {
    drawVerticalSpace(lineNumber) {
        for (let i = 0; i < lineNumber; i++) {
            console.log('');
        }
    }
    drawHorizontalLine() {
        // Gets the available screen width
        const screenWidth = process.stdout.columns;
        const line = ''.padEnd(screenWidth, '-');
        console.log(line);
    }
    ;
    center(valueToCenter) {
        const trimmedValue = valueToCenter.trim();
        // Gets the available screen width
        const screenWidth = process.stdout.columns;
        const leftPadding = Math.floor((screenWidth - trimmedValue.length) / 2);
        console.log(trimmedValue.padStart(leftPadding, ' '));
    }
    ;
}
exports.NativeDrawer = NativeDrawer;
