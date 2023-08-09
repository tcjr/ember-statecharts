import Component from '@glimmer/component';
import { redditMachine } from 'reddit-api/machines/redditMachine';
import { useMachine } from 'ember-statecharts';

export default class MainComponent extends Component {
  redditMachine = useMachine(this, () => {
    const machine = redditMachine.withConfig({
      actions: {},
    });

    console.log('machine is', machine);
    return {
      machine,
      onTransition(state) {
        console.log(`[main] onTransition - ${state.value}`);
      },
    };
  });

  get subreddits() {
    // Sometimes these work, sometimes they return CORS errors
    return ['emberjs', 'reactjs', 'vuejs', 'frontend'];
  }

  selectSubreddit = (evt) => {
    this.redditMachine.send('SELECT', { name: evt.target.value });
  };
}
