type Event = {
  type: string;
  value?: number | Function;
};

type State = number;

interface Command {
  undo(): number;
  type: string;
  value?: number | Function;
  execute(state: State): State;
}

class GenericCommand implements Command {
  type: string;
  value?: number | Function;
  private capturedState: State | null = null;

  constructor(type: string, value?: number | Function) {
    this.type = type;
    this.value = value;
  }

  execute(state: State): State {
    this.capturedState = state;
    if (typeof this.value === 'function') {
      return (this.value as Function)(state);
    } else if (typeof this.value === 'number') {
      switch (this.type) {
        case 'ADD':
          return state + this.value;
        case 'MULTIPLY':
          return state * this.value;
        case 'SET':
          return this.value;
        default:
          throw new Error(`Invalid command type: ${this.type}`);
      }
    }
    throw new Error('Invalid command.');
  }

  undo(): State {
    if (this.capturedState !== null) {
      return this.capturedState;
    }
    throw new Error('Cannot undo, captured state is null.');
  }
}

class EventQueue {
  private position: number;
  private commandHistory: Command[] = [];
  private handlers: ((state: State) => void)[];
  value: number;
  initialState: number;

  constructor({ initialState }: { initialState: State }) {
    this.initialState = initialState;
    this.position = 0;
    this.handlers = [];
    this.value = initialState;
  }

  query(): State {
    return this.value;
  }

  private setState(value: State): void {
    this.value = value;
  }

  assertInvariant(fn: (state: State) => boolean): boolean {
    if (this.commandHistory.length === 0) {
      return fn(this.initialState);
    }
    let currentState = this.initialState;
    for (const command of this.commandHistory) {
      currentState = command.execute(currentState);
      if (!fn(currentState)) {
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

    if (event.type === 'UNDO') {
      if (this.position > 0) {
        this.position -= 1;
        this.setState(this.commandHistory[this.position].undo());
      }
    } else if (event.type === 'REDO') {
      if (this.position < this.commandHistory.length) {
        this.setState(this.commandHistory[this.position].execute(this.value));
        this.position += 1;
      }
    } else {
      const command = new GenericCommand(event.type, event.value);
      if (this.position < this.commandHistory.length) {
        this.position = this.commandHistory.length + 1;
      } else {
        this.position += 1;
      }
      this.commandHistory.push(command);
      this.setState(command.execute(this.value));
    }

    if (prevStateValue !== this.query()) {
      for (const handler of this.handlers) {
        handler(this.query());
      }
    }
  }
}

export default EventQueue;
