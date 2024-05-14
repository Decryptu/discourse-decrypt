import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "display-topic-for-admins",
  initialize() {
    withPluginApi("0.8", (api) => {
      const currentUser = api.getCurrentUser();

      // Log current user and role
      console.log("Current User:", currentUser);
      if (currentUser) {
        console.log("User Role:", currentUser.admin ? "Admin" : "Regular User");
      }

      // Check if custom homepage layout is enabled
      const customHomepageEnabled = settings.custom_homepage_enabled;
      if (!customHomepageEnabled) {
        return;
      }

      // Apply custom layout only for admin users for testing
      if (!currentUser || !currentUser.admin) {
        return;
      }

      // Function to add the custom grid layout on the homepage
      const addCustomGridToHomepage = () => {
        // Check if the current URL is the homepage
        if (window.location.pathname === "/") {
          // Check if the grid already exists
          if (document.querySelector("#custom-homepage-grid")) {
            console.log("Custom grid already exists, not adding again.");
            return;
          }

          // Create the grid container
          const gridContainer = document.createElement("div");
          gridContainer.id = "custom-homepage-grid";
          console.log("Created custom homepage grid.");

          // Append the grid to the homepage
          const homepageContainer = document.querySelector(
            "#ember3.discourse-root.ember-view"
          );
          if (homepageContainer) {
            homepageContainer.appendChild(gridContainer);
            console.log("Appended custom homepage grid to the homepage.");
          } else {
            console.log("Homepage container not found, grid not appended.");
            return;
          }

          // Fetch and display content for each block
          const blockUrls = settings.custom_homepage_blocks.split(',');
          blockUrls.forEach((url, index) => {
            const block = document.createElement("div");
            block.className = `custom-block custom-block-${index + 1}`;
            block.innerHTML = `<p>Loading content from: ${url}</p>`;

            // Fetch content from the URL and insert into block
            fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Network response was not ok ${response.statusText}`);
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

                // Insert the content into the block
                block.innerHTML = content;
                console.log(`Inserted content into block ${index + 1}`);
              })
              .catch((error) => {
                console.error(`Error fetching content for block ${index + 1}:`, error);
                block.innerHTML = "<p>Error loading content</p>";
              });

            gridContainer.appendChild(block);
          });
        } else {
          // Remove the grid if not on the homepage
          const existingGrid = document.querySelector("#custom-homepage-grid");
          if (existingGrid) {
            existingGrid.remove();
            console.log("Removed custom homepage grid as it is not the homepage.");
          }
        }
      };

      // Initial check
      addCustomGridToHomepage();

      // Check on each page change
      api.onPageChange((url, title) => {
        addCustomGridToHomepage();
      });
    });
  },
};
