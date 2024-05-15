// javascripts/discourse/initializers/custom-header.js

import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-header-buttons",

  initialize() {
    withPluginApi("0.8", (api) => {
      api.decorateWidget("header:before", (helper) => {
        // Check screen width to add buttons only on desktop and tablet
        if (window.innerWidth <= 768) {
          return;
        }

        // Ensure this code only runs once
        if (document.querySelector(".custom-header-buttons")) {
          return;
        }

        const logoWrapper = document.querySelector(".home-logo-wrapper-outlet");
        if (logoWrapper) {
          const buttonsContainer = document.createElement("div");
          buttonsContainer.className = "custom-header-buttons";

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

          logoWrapper.parentNode.insertBefore(
            buttonsContainer,
            logoWrapper.nextSibling
          );
        }
      });
    });
  },
};