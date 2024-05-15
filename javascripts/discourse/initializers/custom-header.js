// javascripts/discourse/initializers/custom-header.js

import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

export default {
  name: 'custom-header-buttons',

  initialize() {
    withPluginApi('0.8', api => {
      api.decorateWidget('header:after', helper => {
        // Ensure this code only runs once by checking for the existence of the custom buttons
        if (document.querySelector('.custom-header-buttons')) {
          return;
        }

        // Create container for custom buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'custom-header-buttons';

        buttonsContainer.innerHTML = `
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

        // Find the correct container and insert buttons after the logo
        const logoWrapper = document.querySelector('.home-logo-wrapper-outlet');
        if (logoWrapper) {
          logoWrapper.parentNode.insertBefore(buttonsContainer, logoWrapper.nextSibling);
        }
      });
    });
  }
};
