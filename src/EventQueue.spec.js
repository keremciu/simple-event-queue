import EventQueue from './EventQueue';

describe('EventQueue', () => {
  it('before dispatching actions query returns initial value', () => {
    const queue = new EventQueue({ initialState: -5.2 });
    expect(queue.query()).toEqual(-5.2);
  });

  it('after dispatching ADD event query returns sum', () => {
    const queue = new EventQueue({ initialState: 1 });
    queue.dispatch({
      type: 'ADD',
      value: -2
    });
    expect(queue.query()).toEqual(-1);
    queue.dispatch({
      type: 'ADD',
      value: 12
    });
    expect(queue.query()).toEqual(11);
  });

  it('after dispatching MULTIPLY event query returns product', () => {
    const queue = new EventQueue({ initialState: 1 });
    queue.dispatch({
      type: 'MULTIPLY',
      value: -2
    });
    expect(queue.query()).toEqual(-2);
    queue.dispatch({
      type: 'MULTIPLY',
      value: 12
    });
    expect(queue.query()).toEqual(-24);
  });
});
