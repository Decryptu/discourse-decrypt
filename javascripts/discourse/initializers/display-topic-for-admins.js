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

          // Function to fetch and display topic content
          const fetchAndDisplayContent = (url, container) => {
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

                // Insert the content into the container
                container.innerHTML = content;
                console.log(`Inserted content from ${url} into the container.`);
              })
              .catch((error) => {
                console.error(`Error fetching content from ${url}:`, error);
                container.innerHTML = "<p>Error loading content</p>";
              });
          };

          // Create blocks and fetch content
          topicUrls.forEach((url, index) => {
            const block = document.createElement("div");
            block.className = "admin-block";
            block.style.maxHeight = "400px";
            block.style.overflowY = "scroll";
            block.style.border = "1px solid #ccc";
            block.style.padding = "10px";
            block.style.margin = "10px 0";

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
