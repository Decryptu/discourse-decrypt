import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "second-header",
  initialize() {
    withPluginApi("0.8", (api) => {
      const insertSecondHeader = () => {
        // Check if we are on the homepage and on mobile
        if (window.location.pathname === "/" && window.innerWidth <= 767) {
          // Check if the second header already exists
          if (!document.querySelector(".second-header")) {
            const secondHeader = document.createElement("div");
            secondHeader.className = "second-header";
            secondHeader.innerHTML = `
              <a href="https://cr.cryptoast.fr/t/tuto-de-prise-en-main-de-la-plateforme/7">Tuto prise en main</a>
              <a href="https://cr.cryptoast.fr/t/formation-fondamentale/1765">Formation</a>
              <a href="https://cr.cryptoast.fr/tag/cr/?order=created&period=all">Dernières analyses</a>
            `;

            const header = document.querySelector("header.d-header");
            if (header) {
              header.insertAdjacentElement("afterend", secondHeader);
            }
          }
        } else {
          // Remove the second header if it exists and we are not on the homepage
          const existingSecondHeader = document.querySelector(".second-header");
          if (existingSecondHeader) {
            existingSecondHeader.remove();
          }
        }
      };

      // Run on page change
      api.onPageChange(insertSecondHeader);

      // Run on initial load
      insertSecondHeader();
    });
  },
};
