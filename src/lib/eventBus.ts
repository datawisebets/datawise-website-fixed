import Emitter from 'tiny-emitter';

// Create a single, shared instance of the event emitter
const eventBus = new Emitter();

export default eventBus;