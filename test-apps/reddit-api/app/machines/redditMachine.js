import { Machine, assign, spawn, createMachine } from 'xstate';
import { createSubredditMachine } from './subredditMachine';

async function sayHowdy(context) {
  console.log('howdy - top');
}

export const redditMachine = createMachine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddits: {},
    subreddit: null,
  },
  states: {
    idle: {
      invoke: {
        id: 'say-hello-top-level',
        src: () => sayHowdy,
      },
    },
    selected: {},
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign((context, event) => {
        // Use the existing subreddit actor if one doesn't exist
        let subreddit = context.subreddits[event.name];

        if (subreddit) {
          return {
            ...context,
            subreddit,
          };
        }

        // Otherwise, spawn a new subreddit actor and
        // save it in the subreddits object
        // subreddit = spawn(createSubredditMachine(event.name));
        //
        // Ember-specific changes:
        subreddit = spawn(createSubredditMachine(event.name), {
          name: `subreddit_${event.name}`,
          sync: true,
          autoForward: true,
        });
        debugger;

        return {
          subreddits: {
            ...context.subreddits,
            [event.name]: subreddit,
          },
          subreddit,
        };
      }),
    },
  },
});
