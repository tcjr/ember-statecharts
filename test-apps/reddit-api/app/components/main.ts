import Component from '@glimmer/component';
import redditMachine, {
  RedditContext,
} from 'reddit-api/machines/redditMachine';
import { useMachine } from 'ember-statecharts';
import { toStatePaths } from 'xstate/lib/utils';

interface MainComponentSignature {
  Element: HTMLDivElement;
}

export default class MainComponent extends Component<MainComponentSignature> {
  // @ts-expect-error Not sure how to fix these types
  #redditMachine = useMachine(this, () => {
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

  get context(): RedditContext {
    return this.#redditMachine?.state?.context as RedditContext;
  }

  // Get a string of the current state suitable for an informational data-attr
  get stateAttr(): string {
    return toStatePaths(this.#redditMachine.state?.value).join('__');
  }

  get machineAttr(): string {
    return this.#redditMachine.state?.machine?.id ?? '';
  }

  isInState = (state: string) => {
    return this.#redditMachine?.state?.matches(state);
  };

  get subreddits() {
    // Sometimes these work, sometimes they return CORS errors *shrug*
    return ['emberjs', 'reactjs', 'vuejs', 'frontend'];
  }

  selectSubreddit = (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    if (target) {
      const { value } = target;
      this.#redditMachine.send('SELECT', { name: value });
    }
  };
}
