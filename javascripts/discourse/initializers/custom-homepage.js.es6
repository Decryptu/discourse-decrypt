import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-homepage",

  initialize() {
    withPluginApi("0.8.14", (api) => {
      console.log("Initializing custom homepage script...");

      // Log the site settings
      const siteSettings = api.container.lookup("site-settings:main");
      console.log("Site settings:", siteSettings);

      if (!siteSettings.custom_homepage_enabled) {
        console.log("Custom homepage is not enabled.");
        return;
      }

      const currentUser = api.getCurrentUser();
      console.log("Current user:", currentUser);

      if (!currentUser || !currentUser.admin) {
        console.log("Current user is not an admin.");
        return;
      }

      console.log(
        "Custom homepage is enabled and the current user is an admin."
      );

      const categoriesSection = document.querySelector(
        ".categories-and-latest"
      );
      if (categoriesSection) {
        categoriesSection.style.display = "none";
        console.log("Default categories section hidden.");
      }

      const customHomepage = document.createElement("div");
      customHomepage.classList.add("custom-homepage");

      const blocks = siteSettings.custom_homepage_blocks.split(",");
      console.log("Blocks to be added:", blocks);

      blocks.forEach((block, index) => {
        const blockElement = document.createElement("div");
        blockElement.classList.add("block");
        blockElement.innerHTML = `<iframe src="${block.trim()}" frameborder="0" width="100%" height="300px"></iframe>`;
        customHomepage.appendChild(blockElement);
        console.log(
          `Block ${index + 1} added with content from ${block.trim()}`
        );
      });

      document.querySelector(".contents").prepend(customHomepage);
      console.log("Custom homepage layout prepended to contents.");
    });
  },
};
