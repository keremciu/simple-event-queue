import EventQueue from './EventQueue';

/*
Your goal is to write functionality for asserting an invariant function on the
entire history of an event queue's past states.

You need to implement an assertInvariant method on the event queue class. The
method takes one argument, invariant, of type (state: number) => boolean.
assertInvariant should return true if the provided invariant returns true for
current and all past states of the event queue, false otherwise.

A past state is a value the query method would have returned after
initialization or dispatching an event. Dispatching a new event never changes
existing past states.
*/

describe('EventQueue', () => {
  it('when initial state violates invariant assertInvariant returns false', () => {
    const queue = new EventQueue({ initialState: -5.2 });
    expect(queue.assertInvariant(state => state > 0)).toEqual(false);
  });
  it('when current state violates invariant assertInvariant returns false', () => {
    const queue = new EventQueue({ initialState: 1 });
    queue.dispatch({
      type: 'ADD',
      value: -2
    });
    expect(queue.assertInvariant(state => state > 0)).toEqual(false);
  });
  it('when a past state violates invariant assertInvariant returns false', () => {
    const queue = new EventQueue({ initialState: 2 });
    queue.dispatch({
      type: 'ADD',
      value: 0.1
    });
    queue.dispatch({
      type: 'ADD',
      value: -0.1
    });
    expect(queue.assertInvariant(state => (state | 0) === state)).toEqual(false);
  });
  it('when no past or current state violates invariant assertInvariant returns true', () => {
    const queue = new EventQueue({ initialState: 2 });
    queue.dispatch({
      type: 'ADD',
      value: 0.1
    });
    queue.dispatch({
      type: 'ADD',
      value: -0.1
    });
    expect(queue.assertInvariant(state => state > 0)).toEqual(true);
  });
});
