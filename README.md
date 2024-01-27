# EventQueue

EventQueue is a simple TypeScript class that provides a mechanism for managing a sequence of states and handling events that can modify those states. It supports basic operations like adding, multiplying, setting, undoing, redoing. Additionally, it features a pubsub mechanism allowing functions to subscribe and receive notifications when the state changes.

## Usage

### Installation

```bash
npm install event-queue
```

### Example

```js
import EventQueue from 'event-queue';
const eventQueue = new EventQueue({ initialState: 0 });
const subFn = (state) => {
  console.log('State changed:', state);
}
eventQueue.subscribe(subFn);

eventQueue.dispatch({ type: 'ADD', value: 5 });
eventQueue.dispatch({ type: 'MULTIPLY', value: 2 });

eventQueue.unsubscribe(subFn);
```

### Methods
- query(): State
Returns the current state.

- assertInvariant(fn: (state: State) => boolean): boolean
Asserts that a given invariant function holds for all states in the queue.

- subscribe(fn: (state: State) => void): void
Subscribes a function to be called whenever the state changes.

- unsubscribe(fn: (state: State) => void): void
Unsubscribes a function from state change notifications.

- dispatch(event: Event): void
Handles events to modify the state. Events include 'ADD', 'MULTIPLY', 'SET', 'FUNCTION', 'UNDO', and 'REDO'. The state change triggers subscribed functions.

## Development

### Dependencies

- Node >= 12.0.0
- npm >= 6.0.0

### Installation

Run `npm install` to install dependencies.

### Development

Write debug code in `sandbox.js` and run `npm start` to see the output.

### Testing

Run the command `npm test` to run tests.

