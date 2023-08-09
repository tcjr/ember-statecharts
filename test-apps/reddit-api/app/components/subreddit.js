import Component from '@glimmer/component';
import { useMachine } from 'ember-statecharts';
import { createSubredditMachine } from '../machines/subredditMachine';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long',
});

export default class SubredditComponent extends Component {
  subredditMachine = useMachine(this, () => {
    const machine = createSubredditMachine(this.args.subreddit).withConfig({
      actions: {},
    });

    return {
      machine,
      onTransition(state) {
        console.log(`[subreddit] onTransition - ${state.value}`);
      },
      // hours of debugging, then I found this:
      update: ({ restart }) => {
        restart();
      },
    };
  });

  formatDate = (timestamp) => {
    return dateTimeFormat.format(timestamp);
  };

  retrySubreddit = () => {
    this.subredditMachine.send('RETRY');
  };

  refreshSubreddit = () => {
    this.subredditMachine.send('REFRESH');
  };
}
