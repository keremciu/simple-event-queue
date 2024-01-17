class EventQueue {
  constructor({ initialState }) {
    this.state = initialState;
  }

  query() {
    return this.state;
  }

  dispatch(event) {
    // TODO: implement
  }
}

export default EventQueue;
