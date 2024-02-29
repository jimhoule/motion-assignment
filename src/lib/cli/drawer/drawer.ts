export abstract class Drawer {
    abstract drawVerticalSpace(lineNumber: number): void;
    abstract drawHorizontalLine(): void;
    abstract center(valueToCenter: string): void;
}