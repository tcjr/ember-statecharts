import Component from '@glimmer/component';
//import { useMachine } from 'ember-statecharts';
import { howAboutThis, useMachine } from 'ember-statecharts';

export default class SubredditComponent extends Component {
  subredditMachine = useMachine(this, () => {
    console.log('service machine is', this.args.service);
    return {
      machine: this.args.service,
    };
  });

  okOrNot = howAboutThis(this, () => {});

  // subredditMachine = this.args.service;
}
