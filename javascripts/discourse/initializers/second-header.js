import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "second-header",
  initialize() {
    withPluginApi("0.8", (api) => {
      api.onPageChange((url, title) => {
        // Ensure this runs only on the homepage
        if (url === "/" && window.innerWidth <= 767) {
          // mobile check
          const existingSecondHeader = document.querySelector(".second-header");
          if (!existingSecondHeader) {
            const secondHeader = document.createElement("div");
            secondHeader.className = "second-header";
            secondHeader.innerHTML = `
              <a href="https://cr.cryptoast.fr/t/tuto-de-prise-en-main-de-la-plateforme/7">Tuto prise en main</a>
              <a href="https://cr.cryptoast.fr/t/lancement-du-parcours-de-formation/1444">Formation</a>
              <a href="https://cr.cryptoast.fr/tag/cr/?order=created&period=all">Dernières analyses</a>
            `;

            const header = document.querySelector("header.d-header");
            if (header) {
              header.insertAdjacentElement("afterend", secondHeader);
            }
          }
        }
      });
    });
  },
};
