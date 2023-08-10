import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import {
  createSubredditMachine,
  SubredditContext,
} from '../machines/subredditMachine';
import { toStatePaths } from 'xstate/lib/utils';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long',
});
const formatDate = (timestamp: number) => {
  return dateTimeFormat.format(timestamp);
};

interface SubredditSignature {
  Args: {
    subreddit: string;
  };
  Element: HTMLElement;
}

export default class SubredditComponent extends Component<SubredditSignature> {
  // @ts-expect-error Not sure how to fix these types
  #subredditMachine = useMachine(this, () => {
    return {
      machine: createSubredditMachine(this.args.subreddit),
      onTransition(state) {
        const ctx = state.context as SubredditContext;
        console.log(
          `[subreddit ${ctx.subreddit}] onTransition - ${state.value}`
        );
      },
      // When the args change, restart the machine with the new subreddit
      update: ({ restart }) => {
        restart();
      },
    };
  });

  // State machine utils

  get context(): SubredditContext {
    return this.#subredditMachine?.state?.context as SubredditContext;
  }

  // Get a string of the current state suitable for an informational data-attr
  get stateAttr(): string {
    return toStatePaths(this.#subredditMachine.state?.value).join('__');
  }

  get machineAttr(): string {
    return this.#subredditMachine.state?.machine?.id ?? '';
  }

  isInState = (state: string) => {
    return this.#subredditMachine?.state?.matches(state);
  };

  // Helpers

  formatDate = formatDate;

  // Actions

  retrySubreddit = () => {
    this.#subredditMachine.send('RETRY');
  };

  refreshSubreddit = () => {
    this.#subredditMachine.send('REFRESH');
  };
}
