import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import { createSubredditMachine } from '../machines/subredditMachine';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long',
});

interface SubredditSignature {
  Args: {
    subreddit: string;
  };
  Element: HTMLElement;
}

export default class SubredditComponent extends Component<SubredditSignature> {
  // @ts-expect-error Not sure how to fix these types
  subredditMachine = useMachine(this, () => {
    // const machine = createSubredditMachine(this.args.subreddit);

    return {
      machine: createSubredditMachine(this.args.subreddit),
      onTransition(state) {
        console.log(`[subreddit] onTransition - ${state.value}`);
      },
      // When the args change, restart the machine with the new subreddit
      update: ({ restart }) => {
        restart();
      },
    };
  });

  formatDate = (timestamp: number) => {
    return dateTimeFormat.format(timestamp);
  };

  retrySubreddit = () => {
    this.subredditMachine.send('RETRY');
  };

  refreshSubreddit = () => {
    this.subredditMachine.send('REFRESH');
  };
}
