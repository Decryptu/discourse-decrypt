// javascripts/discourse/initializers/display-topic-for-admins.js

import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "display-topic-for-admins",
  initialize() {
    withPluginApi("0.8", (api) => {
      // Log current user details
      const currentUser = api.getCurrentUser();
      console.log("Current user:", currentUser);

      // Check if the current user is an admin
      if (!currentUser.admin) {
        console.log("User is not an admin, exiting script.");
        return;
      }

      // Log the body structure for debugging
      console.log("Body structure:", document.body);

      // Wait for the DOM to be fully loaded
      window.addEventListener("DOMContentLoaded", () => {
        // Create the div element
        const topicDiv = document.createElement("div");
        topicDiv.id = "admin-topic-display";
        topicDiv.style.maxHeight = "400px";
        topicDiv.style.overflowY = "scroll";
        topicDiv.style.border = "1px solid #ccc";
        topicDiv.style.padding = "10px";
        topicDiv.style.margin = "10px 0";
        console.log("Created topic display div.");

        // Append the div to the homepage (change the selector if needed)
        const homepageContainer = document.querySelector(
          "#main-outlet-wrapper"
        );
        if (homepageContainer) {
          homepageContainer.appendChild(topicDiv);
          console.log("Appended topic display div to the homepage.");
        } else {
          console.log("Homepage container not found, div not appended.");
          return;
        }

        // Fetch the topic content
        const topicId = 1868; // Replace with the topic ID
        const topicUrl = `/t/${topicId}.json`;
        console.log("Fetching topic content from:", topicUrl);

        fetch(topicUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                "Network response was not ok " + response.statusText
              );
            }
            return response.json();
          })
          .then((data) => {
            const postStream = data.post_stream.posts;
            let content = "";

            // Concatenate the posts content
            postStream.forEach((post) => {
              content += post.cooked;
            });

            // Insert the content into the div
            topicDiv.innerHTML = content;
            console.log("Inserted topic content into the div.");
          })
          .catch((error) => {
            console.error("Error fetching topic content:", error);
            topicDiv.innerHTML = "<p>Error loading content</p>";
          });
      });
    });
  },
};
