import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-header",
  initialize() {
    withPluginApi("0.8", (api) => {
      // Ensure this code only runs on desktop
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
            <span class="icon-version" aria-hidden="true">
              <!-- SVG for "Tuto prise en main" icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-check"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path><path d="m9 9.5 2 2 4-4"></path></svg>
            </span>
          </a>
          <a href="https://cr.cryptoast.fr/t/lancement-du-parcours-de-formation/1444" class="header-button">
            <span class="text-version">Formation</span>
            <span class="icon-version" aria-hidden="true">
              <!-- SVG for "Formation" icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
            </span>
          </a>
          <a href="https://cr.cryptoast.fr/tag/cr/?order=created&period=all" class="header-button">
            <span class="text-version">Dernières analyses</span>
            <span class="icon-version" aria-hidden="true">
              <!-- SVG for "Dernières analyses" icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-line-chart"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
            </span>
          </a>
        `;

        logoWrapper.parentNode.insertBefore(
          buttonsContainer,
          logoWrapper.nextSibling
        );
      }
    });
  },
};
