import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';
import { TemplateFactory } from 'ember-cli-htmlbars';
import { HelperLike } from '@glint/template';

// Types for compiled templates
declare module 'reddit-api/templates/*' {
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
  }
}
