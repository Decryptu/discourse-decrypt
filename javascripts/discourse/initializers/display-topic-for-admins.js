import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "display-topic-for-admins",
  initialize() {
    withPluginApi("0.8", (api) => {
      // Check if the current user is an admin
      if (!api.getCurrentUser().admin) {
        return;
      }

      // Create the div element
      const topicDiv = document.createElement("div");
      topicDiv.id = "admin-topic-display";
      topicDiv.style.maxHeight = "400px";
      topicDiv.style.overflowY = "scroll";
      topicDiv.style.border = "1px solid #ccc";
      topicDiv.style.padding = "10px";
      topicDiv.style.margin = "10px 0";

      // Append the div to the homepage (change the selector if needed)
      const homepageContainer = document.querySelector(".top-menu");
      if (homepageContainer) {
        homepageContainer.appendChild(topicDiv);
      }

      // Fetch the topic content
      const topicId = 1868; // Replace with the topic ID
      fetch(`/t/${topicId}.json`)
        .then((response) => response.json())
        .then((data) => {
          const postStream = data.post_stream.posts;
          let content = "";

          // Concatenate the posts content
          postStream.forEach((post) => {
            content += post.cooked;
          });

          // Insert the content into the div
          topicDiv.innerHTML = content;
        })
        .catch((error) => {
          console.error("Error fetching topic content:", error);
          topicDiv.innerHTML = "<p>Error loading content</p>";
        });
    });
  },
};
