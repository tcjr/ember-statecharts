import Component from '@glimmer/component';
import { redditMachine } from 'reddit-api/machines/redditMachine';
import { useMachine } from 'ember-statecharts';

interface MainComponentSignature {
  Element: HTMLDivElement;
}

export default class MainComponent extends Component<MainComponentSignature> {
  // @ts-expect-error Not sure how to fix these types
  redditMachine = useMachine(this, () => {
    const machine = redditMachine.withConfig({
      actions: {},
    });

    return {
      machine,
      onTransition(state) {
        console.log(`[main] onTransition - ${state.value}`);
      },
    };
  });

  get subreddits() {
    // Sometimes these work, sometimes they return CORS errors *shrug*
    return ['emberjs', 'reactjs', 'vuejs', 'frontend'];
  }

  selectSubreddit = (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    if (target) {
      const { value } = target;
      this.redditMachine.send('SELECT', { name: value });
    }
  };
}
