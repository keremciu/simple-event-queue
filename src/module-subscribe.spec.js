import EventQueue from "./EventQueue";

/*
Your goal is to implement a subscribe-publish pattern to invert the messaging
relationship between the event queue and a component listening to its state.

You need to implement methods subscribe and unsubscribe. Both take one
argument, subscriber, of type (state: number) => void. Whenever the state of
the event queue changes (query would return a different value) all callbacks
passed through the subscribe method should be called with the new state. If a
callback is passed to unsubscribe one instance of it should be removed from
subscribers and no longer called on state change.
*/

describe("EventQueue", () => {
  describe("after subscribing", () => {
    it("calls subscriber callbacks when state changes", () => {
      const queue = new EventQueue({ initialState: 0 });
      const subscriber0 = jest.fn();
      queue.subscribe(subscriber0);
      queue.dispatch({
        type: "ADD",
        value: 1,
      });
      expect(subscriber0).toHaveBeenCalledTimes(1);
      expect(subscriber0).toHaveBeenCalledWith(1);
      subscriber0.mockClear();
      const subscriber1 = jest.fn();
      queue.subscribe(subscriber1);
      queue.dispatch({
        type: "MULTIPLY",
        value: 2,
      });
      expect(subscriber0).toHaveBeenCalledTimes(1);
      expect(subscriber0).toHaveBeenCalledWith(2);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber1).toHaveBeenCalledWith(2);
    });
    it("does not call subscriber callbacks when state does not change", () => {
      const queue = new EventQueue({ initialState: 0 });
      const subscriber = jest.fn();
      queue.subscribe(subscriber);
      queue.dispatch({
        type: "ADD",
        value: 0,
      });
      queue.dispatch({
        type: "MULTIPLY",
        value: 2,
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
    describe("and unsubscribing", () => {
      it("does not call subscriber callback when state changes", () => {
        const queue = new EventQueue({ initialState: 1 });
        const subscriber = jest.fn();
        queue.subscribe(subscriber);
        queue.dispatch({
          type: "ADD",
          value: 1,
        });
        subscriber.mockClear();
        queue.unsubscribe(subscriber);
        queue.dispatch({
          type: "MULTIPLY",
          value: 2,
        });
        expect(subscriber).not.toHaveBeenCalled();
      });
      it("removes one instance of a subscriber per unsubscribe", () => {
        const queue = new EventQueue({ initialState: 1 });
        const subscriber = jest.fn();
        const subscriber2 = jest.fn();
        queue.subscribe(subscriber);
        queue.subscribe(subscriber2);
        queue.subscribe(subscriber);
        queue.unsubscribe(subscriber);
        queue.dispatch({
          type: "ADD",
          value: 1,
        });
        queue.unsubscribe(subscriber);
        queue.dispatch({
          type: "ADD",
          value: 1,
        });
        expect(subscriber).toHaveBeenCalledTimes(1);
      });
      it("removes subscriber based on identity", () => {
        const queue = new EventQueue({ initialState: 1 });
        class Sub {
          constructor() {
            this.callback = jest.fn();
          }
          listen(state) {
            this.callback(state);
          }
        }
        const [sub1, sub2, sub3] = [new Sub(), new Sub(), new Sub()];
        const subscriber1 = sub1.listen.bind(sub1);
        const subscriber2 = sub2.listen.bind(sub2);
        const subscriber3 = sub2.listen.bind(sub3);
        // subscriber1, subscriber2 and subscriber3 have the same string value
        queue.subscribe(subscriber1);
        queue.subscribe(subscriber2);
        queue.subscribe(subscriber3);
        queue.unsubscribe(subscriber2);
        queue.dispatch({
          type: "ADD",
          value: 1,
        });
        expect(sub1.callback).toHaveBeenCalled();
        expect(sub2.callback).not.toHaveBeenCalled();
        expect(sub3.callback).toHaveBeenCalled();
      });
      it("when unsubscribe target is not a subscriber subscribers remain unchanged", () => {
        const queue = new EventQueue({ initialState: 1 });
        const subscriber = jest.fn();
        const notASubscriber = jest.fn();
        queue.subscribe(subscriber);
        try {
          queue.unsubscribe(notASubscriber);
        } catch (e) {
          // unsubscribe may or may not throw in this case. Either behavior is considered "legal".
        }
        queue.dispatch({
          type: "ADD",
          value: 1,
        });
        expect(subscriber).toHaveBeenCalledTimes(1);
      });
    });
  });
});
