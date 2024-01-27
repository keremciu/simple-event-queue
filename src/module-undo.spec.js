import EventQueue from "./EventQueue";

/*
Your goal is to add support for UNDO and REDO events that allow going back
on previously dispatched events.

Any "undone" events are stored for a possible "redo". If an event other than
an UNDO or REDO event is dispatched to the queue "undone" events can no longer
be "redone".

UNDO event
{
  type: 'UNDO'
}
Reverts state one step back to before previous event. If previous event is an
UNDO event reverts the event before the previous reverted event.

REDO event
```
{
  type: 'REDO'
}
Applies the most recent "undone" event if any are stored and removes it from the store.
*/

describe("EventQueue", () => {
  it("after dispatching UNDO event query returns previous state value", () => {
    const queue = new EventQueue({ initialState: 4 });
    queue.dispatch({
      type: "ADD",
      value: 2.1,
    });
    queue.dispatch({
      type: "UNDO",
    });
    expect(queue.query()).toEqual(4);
  });
  it("after dispatching UNDO events, REDO event will reapply an undone event starting with latest", () => {
    const queue = new EventQueue({ initialState: 4 });
    
    queue.dispatch({
      type: "ADD",
      value: 2.1,
    });
    queue.dispatch({
      type: "ADD",
      value: 5,
    });
    queue.dispatch({
      type: "UNDO",
    });
    queue.dispatch({
      type: "UNDO",
    });
    expect(queue.query()).toEqual(4);
    queue.dispatch({
      type: "REDO",
    });
    expect(queue.query()).toEqual(6.1);
    queue.dispatch({
      type: "REDO",
    });
    expect(queue.query()).toEqual(11.1);
  });
  it('after dispatching UNDO event, new event clears "REDO history" and REDO event will not reapply previous event', () => {
    const queue = new EventQueue({ initialState: 4 });
    queue.dispatch({
      type: "ADD",
      value: 2.1,
    });
    queue.dispatch({
      type: "UNDO",
    });
    queue.dispatch({
      type: "ADD",
      value: 5,
    });
    queue.dispatch({
      type: "REDO",
    });
    expect(queue.query()).toEqual(9);
  });

  describe("undo integration with invariant", () => {
    const testFn =
      typeof new EventQueue({ initialState: 0 }).assertInvariant === "function"
        ? it
        : it.skip;
    testFn("A violation of an invariant after being reverted by an UNDO event still fails invariant assertion", () => {
      const queue = new EventQueue({ initialState: 0 });
      queue.dispatch({ type: "ADD", value: -1 });
      queue.dispatch({ type: "UNDO" });
      queue.dispatch({ type: "ADD", value: 1 });
      expect(queue.assertInvariant((state) => state >= 0)).toEqual(false);
    });
  });
});
