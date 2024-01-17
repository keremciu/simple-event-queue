# Smartly.io Coding Interview Exercise

Your goal in this exercise is to implement a partial event queue that calculates its state from events provided to it.

## Dependencies

- Node >= 12.0.0
- npm >= 6.0.0

## Installation

Run `npm install` to install dependencies.

## Development

Write debug code in `sandbox.js` and run `npm start` to see the output.

## Testing

Run the command `npm test` to run tests.

## Requirements

You need to implement the `dispatch` method of the `EventQueue` class. `dispatch` takes one argument, `event`, and returns nothing.

The type interface of `event` is

```
{
  type: 'ADD' | 'MULTIPLY',
  value: number
}
```
.

Calling `dispatch` should cause the `query` method to return a new value. After dispatching an `ADD` event the `query` method should return a number that equals `event.value` plus the previous value. After dispatching a `MULTIPLY` event the `query` method should return a number that equals `event.value` times the previous value. You need not consider `NaN` values.

Additional requirements will be introduced as the interview progresses.
