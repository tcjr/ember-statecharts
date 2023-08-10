import { assign, createMachine } from 'xstate';
import data from './data-snapshot.json';
import { shuffle } from 'reddit-api/utils/array';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The real reddit API is unreliable, so I'm just returning a static snapshot.
async function invokeFakeSubreddit() {
  await sleep(Math.random() * 1200);
  // fail 15% of the time
  if (Math.random() < 0.15) {
    throw new Error('Failed to fetch subreddit');
  }
  const posts = data.data.children.map((child: { data: any }) => child.data);
  return shuffle(posts);
}

// async function invokeFetchSubreddit(context: SubredditContext) {
//   const { subreddit } = context;

//   return fetch(`https://api.reddit.com/r/${subreddit}.json`, {
//     mode: 'no-cors',
//   })
//     .then((response) => response.json())
//     .then((json) =>
//       json.data.children.map((child: { data: any }) => child.data)
//     );
// }

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

export function createSubredditMachine(subreddit: string) {
  return createMachine({
    id: 'subreddit',
    initial: 'loading',
    context: {
      subreddit, // subreddit name passed in
      posts: null,
      lastUpdated: null,
    } as SubredditContext,
    schema: {
      context: {} as SubredditContext,
      events: {} as SubredditEvent,
    },
    states: {
      loading: {
        invoke: {
          id: 'fetch-subreddit',
          // src: invokeFetchSubreddit,
          src: invokeFakeSubreddit,
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
