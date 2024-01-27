type Event = {
  type: string;
  value?: number | Function;
};

type State = number;

class EventQueue {
  private states: State[];
  private position: number;
  private handlers: ((state: State) => void)[];

  constructor({ initialState }: { initialState: State }) {
    this.states = [initialState];
    this.position = 0;
    this.handlers = [];
  }

  query(): State {
    return this.states[this.position];
  }

  setState(value: State): void {
    this.states.push(value);
    this.position += 1;
  }

  assertInvariant(fn: (state: State) => boolean): boolean {
    for (const state of this.states) {
      if (!fn(state)) {
        return false;
      }
    }
    return true;
  }

  subscribe(fn: (state: State) => void): void {
    this.handlers.push(fn);
  }

  unsubscribe(fn: (state: State) => void): void {
    const firstSub = this.handlers.findIndex((handler) => handler === fn);
    if (firstSub > -1) {
      this.handlers.splice(firstSub, 1);
    }
  }

  dispatch(event: Event): void {
    const prevStateValue = this.query();
    switch (event.type) {
      case 'ADD':
        if (typeof event.value !== "number") {
          throw new Error('Please provide a number as event value to dispatch add');
        }
        this.setState(this.query() + event.value);
        break;
      case 'MULTIPLY':
        if (typeof event.value !== "number") {
          throw new Error('Please provide a number as event value to dispatch multiply');
        }
        this.setState(this.query() * event.value);
        break;
      case 'SET':
        if (typeof event.value !== "number") {
          throw new Error('Please provide a number as event value to dispatch set');
        }
        this.setState(event.value);
        break;
      case 'FUNCTION':
        if (typeof event.value !== "function") {
          throw new Error('Please provide a number as event value to dispatch set');
        }
        this.setState(event.value(this.query()));
        break;
      case 'UNDO':
        if (this.position > 0) {
          this.position -= 1;
        }
        break;
      case 'REDO':
        if (this.position < this.states.length - 1) {
          this.position += 1;
        }
        break;
      default:
        break;
    }
    if (prevStateValue !== this.query()) {
      for (const handler of this.handlers) {
        handler(this.query());
      }
    }
  }
}

export default EventQueue;
