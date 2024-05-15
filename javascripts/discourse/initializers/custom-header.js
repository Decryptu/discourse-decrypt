// javascripts/discourse/initializers/custom-header.js

import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'custom-header-buttons',
  initialize() {
    withPluginApi('0.8', api => {
      api.createWidget('custom-header-buttons', {
        tagName: 'div.custom-header-buttons',
        html() {
          return `
            <a href="https://cr.cryptoast.fr/t/tuto-de-prise-en-main-de-la-plateforme/7" class="header-button">
              <span class="text-version">Tuto prise en main</span>
            </a>
            <a href="https://cr.cryptoast.fr/t/lancement-du-parcours-de-formation/1444" class="header-button">
              <span class="text-version">Formation</span>
            </a>
            <a href="https://cr.cryptoast.fr/tag/cr/?order=created&period=all" class="header-button">
              <span class="text-version">Dernières analyses</span>
            </a>
          `;
        }
      });

      api.decorateWidget('header-buttons:before', helper => {
        return helper.attach('custom-header-buttons');
      });
    });
  }
};
