import { module, test } from 'qunit';
import { setupRenderingTest } from 'reddit-api/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | subreddit', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Subreddit />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Subreddit>
        template block text
      </Subreddit>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
