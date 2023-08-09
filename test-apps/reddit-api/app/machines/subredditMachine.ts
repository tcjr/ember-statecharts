import { StateMachine, assign, createMachine } from 'xstate';
// import { data } from './data-snapshot';

export interface SubredditContext {
  subreddit: string;
  posts: any[] | null;
  lastUpdated: number | null;
}

export type SubredditEvent =
  | {
      type: 'RETRY';
    }
  | {
      type: 'REFRESH';
    };

// const sleep = (ms:number) => new Promise((r) => setTimeout(r, ms));

// async function invokeFetchSubreddit() {
//   await sleep(1500);
//   // fail 50% of the time
//   if (Math.random() < 0.5) {
//     throw new Error('Failed to fetch subreddit');
//   }
//   return data.data.children.map((child: { data: any; }) => child.data);
// }

async function invokeFetchSubreddit(context: SubredditContext) {
  const { subreddit } = context;

  return fetch(`https://api.reddit.com/r/${subreddit}.json`)
    .then((response) => response.json())
    .then((json) =>
      json.data.children.map((child: { data: any }) => child.data)
    );
}

export function createSubredditMachine(
  subreddit: string
): StateMachine<SubredditContext, any, SubredditEvent> {
  return createMachine<SubredditContext, SubredditEvent>({
    id: 'subreddit',
    initial: 'loading',
    context: {
      subreddit, // subreddit name passed in
      posts: null,
      lastUpdated: null,
    },
    states: {
      loading: {
        invoke: {
          id: 'fetch-subreddit',
          src: invokeFetchSubreddit,
          onDone: {
            target: 'loaded',
            actions: assign({
              posts: (_, event) => event.data,
              lastUpdated: () => Date.now(),
            }),
          },
          onError: 'failure',
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
}
