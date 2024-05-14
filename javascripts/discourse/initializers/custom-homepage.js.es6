import { withPluginApi } from "discourse/lib/plugin-api";

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

      // Use Ember's run loop to wait for the DOM to be fully rendered
      api.onPageChange((url, title) => {
        console.log("Page changed:", url, title);

        // Wait for the DOM to be fully rendered
        Ember.run.scheduleOnce("afterRender", this, () => {
          const mainOutlet = document.getElementById("main-outlet");
          if (!mainOutlet) {
            console.error("Main outlet not found");
            return;
          }

          // Hide default categories section
          mainOutlet.style.display = "none";

          // Create custom blocks container
          const customContainer = document.createElement("div");
          customContainer.id = "custom-homepage-container";
          customContainer.style.display = "grid";
          customContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
          customContainer.style.gridGap = "20px";

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
          mainOutlet.parentNode.insertBefore(
            customContainer,
            mainOutlet.nextSibling
          );
        });
      });
    });
  },
};
