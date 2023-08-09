import { assign, createMachine } from 'xstate';

export const redditMachine = createMachine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
  },
  states: {
    idle: {},
    selected: {}, // no invocations!
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        subreddit: (context, event) => event.name,
      }),
    },
  },
});
