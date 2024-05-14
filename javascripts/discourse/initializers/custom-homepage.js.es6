import { withPluginApi } from "discourse/lib/plugin-api";
import { scheduleOnce } from "@ember/runloop";

export default {
  name: "custom-homepage",

  initialize(container) {
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

      // Log setting value
      console.log(
        "Custom Homepage Blocks Setting:",
        settings.custom_homepage_blocks
      );

      // Function to insert custom layout
      function insertCustomLayout() {
        const existingContainer = document.getElementById(
          "custom-homepage-container"
        );
        if (existingContainer) {
          console.log("Custom homepage container already present.");
          return;
        }

        const mainContent = document.querySelector(".below-site-header-outlet");
        if (!mainContent) {
          console.error("Main content area not found");
          return;
        }

        // Create custom blocks container
        const customContainer = document.createElement("div");
        customContainer.id = "custom-homepage-container";
        customContainer.style.display = "grid";
        customContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
        customContainer.style.gridGap = "20px";
        customContainer.style.margin = "20px";

        // Fetch and display content for each block
        const blockUrls = settings.custom_homepage_blocks.split(",");
        blockUrls.forEach((url, index) => {
          const block = document.createElement("div");
          block.className = "custom-block";
          block.innerHTML = `<p>Loading content from: ${url}</p>`;

          // Fetch content from the URL and insert into block
          fetch(url)
            .then((response) => response.text())
            .then((data) => {
              block.innerHTML = data;
              console.log(`Content loaded for block ${index + 1}`);
            })
            .catch((error) => {
              block.innerHTML = `<p>Error loading content from: ${url}</p>`;
              console.error(
                `Error loading content for block ${index + 1}:`,
                error
              );
            });

          customContainer.appendChild(block);
        });

        // Insert custom container into the page
        mainContent.insertBefore(customContainer, mainContent.firstChild);
      }

      // Use Ember's run loop to wait for the DOM to be fully rendered
      api.onPageChange((url, title) => {
        console.log("Page changed:", url, title);

        // Wait for the DOM to be fully rendered
        scheduleOnce("afterRender", this, insertCustomLayout);
      });

      // Mutation Observer to monitor changes in the DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (!document.getElementById("custom-homepage-container")) {
            console.log("Custom homepage container not found, reinserting...");
            scheduleOnce("afterRender", this, insertCustomLayout);
          }
        });
      });

      // Start observing the main content area for changes
      const mainContent = document.querySelector(".below-site-header-outlet");
      if (mainContent) {
        observer.observe(mainContent, { childList: true, subtree: true });
      }
    });
  },
};
