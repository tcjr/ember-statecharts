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
        console.log(`onTransition - ${state.value}`);
      },
    };
  });

  selectSubreddit = (name) => {
    this.redditMachine.send('SELECT', { name });
  };
}
