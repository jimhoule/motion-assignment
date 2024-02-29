export abstract class EventHandler {
    abstract handleHelp(): void;
    abstract handleExit(): void;
    abstract handleFetch(fullStringInput: string): Promise<void>;
}