class EventQueue {
  constructor({ initialState }) {
    this.state = initialState;
    this.handlers = []
    this.prevStates = [initialState]
    this.undoIsLatest = false
  }

  query() {
    return this.state;
  }

  assertInvariant(fn) {
    for (const prevState of this.prevStates) {
      if (!fn(prevState)) {
        return false;
      }
    }
    return true;
  }

  subscribe(fn) {
    this.handlers.push(fn)
  }

  unsubscribe(fn) {
    const firstSub = this.handlers.findIndex(handler => handler === fn)
    if (firstSub > -1) {
      this.handlers.splice(firstSub, 1)
    }
  }

  dispatch(event) {
    const prevValue = this.state;
    switch (event.type) {
      case 'ADD':
        this.undoIsLatest = false
        this.state += event.value;
        break;
      case 'MULTIPLY':
        this.undoIsLatest = false
        this.state *= event.value;
        break;
      case 'SET':
        this.undoIsLatest = false
        this.state = event.value;
        break;
      case 'FUNCTION':
        this.undoIsLatest = false
        this.state = event.value(this.state)
        break;
      case 'UNDO':
        this.undoIsLatest = true
        this.undoLatestIndex = this.prevStates.length -2
        this.state = this.prevStates[this.prevStates.length -2]
        break;
      case 'REDO':
        console.log(this.undoIsLatest)
        if (this.undoIsLatest) {
          console.log(this.undoLatestIndex)
          this.state = this.prevStates[this.undoLatestIndex + 1]
        }
        break;
      default:
        break;
    }
    this.prevStates.push(this.state)
    if (prevValue !== this.state) {
      for (handler of this.handlers) {
        handler(this.state);
      }
    }
  }
}

export default EventQueue;
