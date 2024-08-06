// javascripts/discourse/initializers/custom-header.js

import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

export default {
  name: 'custom-header-buttons',

  initialize() {
    withPluginApi('0.8', api => {
      api.createWidget('custom-header-buttons', {
        tagName: 'div.custom-header-buttons',
        buildKey: () => 'custom-header-buttons',

        html() {
          return [
            h('a.header-button', { href: 'https://cr.cryptoast.fr/c/bienvenue-informations/4' }, 
              h('span.text-version', 'Guide de bienvenue')),
            h('a.header-button', { href: 'https://cr.cryptoast.fr/t/formation-fondamentale/1765' }, 
              h('span.text-version', 'Formation')),
            h('a.header-button', { href: 'https://cr.cryptoast.fr/tag/cr/?order=created&period=all' }, 
              h('span.text-version', 'Dernières analyses'))
          ];
        }
      });

      api.decorateWidget('header-buttons:before', helper => {
        return helper.attach('custom-header-buttons');
      });
    });
  }
};
