// javascripts/discourse/initializers/custom-header.js

import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";

export default {
  name: "custom-header-buttons",

  initialize() {
    withPluginApi("0.8", (api) => {
      api.createWidget("custom-header-buttons", {
        tagName: "div.custom-header-buttons",
        buildKey: () => "custom-header-buttons",

        html() {
          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            return [
              h(
                "a.header-button",
                {
                  href: "https://cr.cryptoast.fr/t/tuto-de-prise-en-main-de-la-plateforme/7",
                },
                h(
                  "svg",
                  { viewBox: "0 0 24 24", width: "24", height: "24" },
                  h("circle", { cx: "12", cy: "12", r: "10", fill: "gray" })
                )
              ),
              h(
                "a.header-button",
                {
                  href: "https://cr.cryptoast.fr/t/lancement-du-parcours-de-formation/1444",
                },
                h(
                  "svg",
                  { viewBox: "0 0 24 24", width: "24", height: "24" },
                  h("rect", {
                    x: "4",
                    y: "4",
                    width: "16",
                    height: "16",
                    fill: "gray",
                  })
                )
              ),
              h(
                "a.header-button",
                {
                  href: "https://cr.cryptoast.fr/tag/cr/?order=created&period=all",
                },
                h(
                  "svg",
                  { viewBox: "0 0 24 24", width: "24", height: "24" },
                  h("polygon", { points: "12,2 22,22 2,22", fill: "gray" })
                )
              ),
            ];
          }
            return [
              h(
                "a.header-button",
                {
                  href: "https://cr.cryptoast.fr/t/tuto-de-prise-en-main-de-la-plateforme/7",
                },
                h("span.text-version", "Tuto prise en main")
              ),
              h(
                "a.header-button",
                {
                  href: "https://cr.cryptoast.fr/t/lancement-du-parcours-de-formation/1444",
                },
                h("span.text-version", "Formation")
              ),
              h(
                "a.header-button",
                {
                  href: "https://cr.cryptoast.fr/tag/cr/?order=created&period=all",
                },
                h("span.text-version", "Dernières analyses")
              ),
            ];
        },
      });

      api.decorateWidget("header-buttons:before", (helper) => {
        return helper.attach("custom-header-buttons");
      });
    });
  },
};
