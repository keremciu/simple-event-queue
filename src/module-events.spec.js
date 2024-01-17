import EventQueue from "./EventQueue";

/*
Your goal is to expand the vocabulary of events that can be dispatched with two
new types: SET and FUNCTION.

After a SET event is dispatched query should return the value of the SET
event.

After a FUNCTION event is dispatched query should return the previous value
transformed by a function provided as the value of the event. The function is
always of type (state: number) => number and a pure function.
*/

describe("EventQueue", () => {
  it("after dispatching SET event query returns set value", () => {
    const queue = new EventQueue({ initialState: 4 });
    queue.dispatch({
      type: "SET",
      value: 2.1,
    });
    expect(queue.query()).toEqual(2.1);
  });
  it("after dispatching FUNCTION event query returns previous state transformed by value", () => {
    const queue = new EventQueue({ initialState: 4.2 });
    queue.dispatch({
      type: "FUNCTION",
      value: (state) => state | 0,
    });
    expect(queue.query()).toEqual(4);
    queue.dispatch({
      type: "FUNCTION",
      value: (state) => state + state * state,
    });
    expect(queue.query()).toEqual(20);
  });
});
