import EventQueue from './src/EventQueue';

const queue = new EventQueue({ initialState: 0 });

console.log(`State is ${queue.query()}`);
