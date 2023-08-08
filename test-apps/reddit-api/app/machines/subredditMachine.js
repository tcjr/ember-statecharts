import { Machine, assign, createMachine } from 'xstate';

async function invokeFetchSubreddit(context) {
  const { subreddit } = context;
  debugger;
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then((response) => response.json())
    .then((json) => json.data.children.map((child) => child.data));
}

async function sayHowdy(context) {
  console.log('howdy - child');
}

function temporaryLogOnEntryForLoading(context) {
  // debugger
  console.log('temporaryLogOnEntryForLoading', context);
}

export const createSubredditMachine = (subreddit) => {
  return createMachine({
    id: 'subreddit',
    initial: 'loading',
    context: {
      subreddit, // subreddit name passed in
      posts: null,
      lastUpdated: null,
      misc: 'nada',
    },
    states: {
      loading: {
        entry: [temporaryLogOnEntryForLoading],
        // invoke: {
        //   id: 'fetch-subreddit',
        //   src: () => invokeFetchSubreddit,
        //   // onDone: {
        //   //   target: 'loaded',
        //   //   actions: assign({
        //   //     posts: (_, event) => event.data,
        //   //     lastUpdated: () => Date.now(),
        //   //   }),
        //   // },
        //   // onError: 'failure',
        // },
        invoke: {
          id: 'say-hello-child-level',
          src: () => sayHowdy,
        },
      },
      loaded: {
        on: {
          REFRESH: 'loading',
        },
      },
      failure: {
        on: {
          RETRY: 'loading',
        },
      },
    },
  });
};
