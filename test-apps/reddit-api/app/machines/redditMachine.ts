import { assign, createMachine } from 'xstate';

export interface RedditContext {
  subreddit: string | null;
}

export type RedditEvent = {
  type: 'SELECT';
  name: string;
};

export default createMachine<RedditContext, RedditEvent>({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
  },
  schema: {
    context: {} as RedditContext,
    events: {} as RedditEvent,
  },
  states: {
    idle: {},
    selected: {}, // no invocations!
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        subreddit: (_context, event) => event.name,
      }),
    },
  },
  predictableActionArguments: true,
});
