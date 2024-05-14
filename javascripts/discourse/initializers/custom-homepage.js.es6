import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-homepage",

  initialize(container) {
    withPluginApi("0.8.7", (api) => {
      console.log("Initializing custom homepage script...");

      if (!api.getSiteSetting("custom_homepage_enabled")) {
        console.log("Custom homepage is not enabled.");
        return;
      }

      const currentUser = api.getCurrentUser();
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

      const blocks = [
        api.getSiteSetting("custom_homepage_block1"),
        api.getSiteSetting("custom_homepage_block2"),
        api.getSiteSetting("custom_homepage_block3"),
        api.getSiteSetting("custom_homepage_block4"),
        api.getSiteSetting("custom_homepage_block5"),
      ];

      blocks.forEach((block, index) => {
        const blockElement = document.createElement("div");
        blockElement.classList.add("block");
        blockElement.innerHTML = `<iframe src="${block}" frameborder="0" width="100%" height="300px"></iframe>`;
        customHomepage.appendChild(blockElement);
        console.log(`Block ${index + 1} added with content from ${block}`);
      });

      document.querySelector(".contents").prepend(customHomepage);
      console.log("Custom homepage layout prepended to contents.");
    });
  },
};
