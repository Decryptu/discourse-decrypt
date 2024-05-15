// javascripts/discourse/initializers/display-topic-for-admins.js

import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "display-topic-for-admins",
  initialize() {
    withPluginApi("0.8", (api) => {
      const currentUser = api.getCurrentUser();

      // Function to add the grid to the homepage
      const addGridToHomepage = () => {
        // Check if the current URL is the homepage and if the user is an admin
        if (
          window.location.pathname === "/" &&
          currentUser &&
          currentUser.admin
        ) {
          // Check if the grid already exists
          if (document.querySelector("#admin-grid-display")) {
            console.log("Grid already exists, not adding again.");
            return;
          }

          // Create the grid container
          const gridContainer = document.createElement("div");
          gridContainer.id = "admin-grid-display";
          gridContainer.className = "admin-grid";
          console.log("Created grid display container.");

          // Find the target location to insert the grid container
          const bannerDiv = document.querySelector("#ember7");
          const mainOutletWrapper = document.querySelector(
            "#main-outlet-wrapper"
          );

          if (bannerDiv && mainOutletWrapper) {
            // Insert the grid container between bannerDiv and mainOutletWrapper
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

          // Hardcoded topic URLs
          const topicUrls = [
            "https://cr.cryptoast.fr/t/analyses-a-la-une/1892",
            "https://cr.cryptoast.fr/t/actualites-crypto-a-la-une/1893",
          ];

          // Function to create skeleton loader
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

          // Function to fetch and display topic content
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

                // Use for...of loop to concatenate the posts content
                for (const post of postStream) {
                  content += post.cooked;
                }

                // Remove the skeleton loader
                container.removeChild(skeletonLoader);

                // Insert the content into the container
                container.innerHTML = content;
                console.log(`Inserted content from ${url} into the container.`);

                // Create and append the collapse button to the block
                const collapseButton = createCollapseButton(container);
                container.appendChild(collapseButton);
              })
              .catch((error) => {
                console.error(`Error fetching content from ${url}:`, error);
                container.innerHTML = "<p>Error loading content</p>";
              });
          };

          // Function to create a collapse button
          const createCollapseButton = (container) => {
            const button = document.createElement("button");
            button.className = "collapse-button";
            button.innerHTML = "&#x25B2;"; // Chevron up symbol

            button.addEventListener("click", () => {
              const isCollapsed = container.classList.toggle("collapsed");
              container.style.maxHeight = isCollapsed ? "24px" : "400px"; // Toggle height
              button.innerHTML = isCollapsed ? "&#x25BC;" : "&#x25B2;"; // Toggle chevron symbol
              button.style.transform = isCollapsed
                ? "rotate(270deg)"
                : "rotate(0deg)"; // Toggle rotation
            });

            return button;
          };

          // Create blocks and fetch content
          topicUrls.forEach((url, index) => {
            const block = document.createElement("div");
            block.className = "admin-block";
            block.style.maxHeight = window.innerWidth <= 768 ? "24px" : "400px"; // Set default state based on screen width
            block.style.overflowY = "scroll";
            block.style.padding = "10px";
            block.style.margin = "10px 0";

            if (window.innerWidth <= 768) {
              block.classList.add("collapsed"); // Default collapsed on mobile
            }

            // Append the block to the grid container
            gridContainer.appendChild(block);
            console.log(`Appended block ${index + 1} to the grid container.`);

            // Fetch and display content in the block
            fetchAndDisplayContent(url, block);
          });
        } else {
          // Remove the grid if not on the homepage or if the user is not an admin
          const existingGrid = document.querySelector("#admin-grid-display");
          if (existingGrid) {
            existingGrid.remove();
            console.log(
              "Removed grid display container as it is not the homepage or user is not an admin."
            );
          }
        }
      };

      // Initial check
      addGridToHomepage();

      // Check on each page change
      api.onPageChange((url, title) => {
        addGridToHomepage();
      });
    });
  },
};
