import { EventEmitter } from 'node:events';
import { NativeEventHandler } from './lib/cli/event-handler/native-event-handler';
import { NativeDrawer } from './lib/cli/drawer/native-drawer';
import { Cli } from './lib/cli/cli';

const eventEmitter = new EventEmitter();
const drawer = new NativeDrawer();
const eventHandler = new NativeEventHandler(drawer);

new Cli(eventEmitter, eventHandler).init();