import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "display-topic-for-all-users",
  initialize() {
    withPluginApi("0.8", (api) => {
      const addGridToHomepage = () => {
        if (window.location.pathname === "/") {
          if (document.querySelector("#admin-grid-display")) {
            console.log("Grid already exists, not adding again.");
            return;
          }

          const gridContainer = document.createElement("div");
          gridContainer.id = "admin-grid-display";
          gridContainer.className = "admin-grid";
          console.log("Created grid display container.");

          const bannerDiv = document.querySelector("#ember7");
          const mainOutletWrapper = document.querySelector(
            "#main-outlet-wrapper"
          );

          if (bannerDiv && mainOutletWrapper) {
            mainOutletWrapper.parentNode.insertBefore(
              gridContainer,
              mainOutletWrapper
            );
            console.log(
              "Inserted grid display container between banner and main outlet."
            );
          } else {
            console.log("Target divs not found, grid not inserted.");
            return;
          }

          const topicUrls = [
            "https://cr.cryptoast.fr/t/analyses-a-la-une/1892",
            "https://cr.cryptoast.fr/t/actualites-crypto-a-la-une/1893",
          ];

          const createSkeletonLoader = () => {
            const skeleton = document.createElement("div");
            skeleton.className = "skeleton-loader";
            for (let i = 0; i < 5; i++) {
              const skeletonBlock = document.createElement("div");
              skeletonBlock.className = "skeleton-block";
              skeleton.appendChild(skeletonBlock);
            }
            return skeleton;
          };

          const fetchAndDisplayContent = (url, container) => {
            const skeletonLoader = createSkeletonLoader();
            container.appendChild(skeletonLoader);

            fetch(`${url}.json`)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    `Network response was not ok ${response.statusText}`
                  );
                }
                return response.json();
              })
              .then((data) => {
                const postStream = data.post_stream.posts;
                let content = "";

                for (const post of postStream) {
                  content += post.cooked;
                }

                container.removeChild(skeletonLoader);
                container.innerHTML = content;
                console.log(`Inserted content from ${url} into the container.`);

                const collapseButton = createCollapseButton(container);
                container.appendChild(collapseButton);

                adjustScrollbars();
              })
              .catch((error) => {
                console.error(`Error fetching content from ${url}:`, error);
                container.innerHTML = "<p>Error loading content</p>";
              });
          };

          const createCollapseButton = (container) => {
            const button = document.createElement("button");
            button.className = "collapse-button";
            button.innerHTML = container.classList.contains("collapsed")
              ? "&#x25BC;" // Chevron down symbol
              : "&#x25B2;"; // Chevron up symbol

            button.addEventListener("click", () => {
              const isCollapsed = container.classList.toggle("collapsed");
              container.style.maxHeight = isCollapsed ? "20px" : "400px";
              button.innerHTML = isCollapsed ? "&#x25BC;" : "&#x25B2;";
            });

            return button;
          };

          topicUrls.forEach((url, index) => {
            const block = document.createElement("div");
            block.className = "admin-block";
            block.style.maxHeight = window.innerWidth <= 768 ? "20px" : "400px";
            block.style.overflowY = "hidden"; // Initially set to hidden
            block.style.padding = "10px";
            block.style.margin = "10px 0";

            if (window.innerWidth <= 768) {
              block.classList.add("collapsed");
            }

            gridContainer.appendChild(block);
            console.log(`Appended block ${index + 1} to the grid container.`);

            fetchAndDisplayContent(url, block);
          });
        } else {
          const existingGrid = document.querySelector("#admin-grid-display");
          if (existingGrid) {
            existingGrid.remove();
            console.log(
              "Removed grid display container as it is not the homepage."
            );
          }
        }
      };

      const adjustScrollbars = () => {
        const adminBlocks = document.querySelectorAll(".admin-block");
        for (const block of adminBlocks) {
          const isScrollNeeded = block.scrollHeight > block.clientHeight;
          block.style.overflowY = isScrollNeeded ? "auto" : "hidden";
        }
      };

      addGridToHomepage();

      api.onPageChange((url, title) => {
        addGridToHomepage();
      });

      window.addEventListener("resize", adjustScrollbars);
    });
  },
};
