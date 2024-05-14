// javascripts/discourse/initializers/display-topic-for-admins.js

import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "display-topic-for-admins",
  initialize() {
    withPluginApi("0.8", (api) => {
      // Function to add the div on the homepage
      const addDivToHomepage = () => {
        // Check if the current URL is the homepage
        if (window.location.pathname === "/") {
          // Check if the div already exists
          if (document.querySelector("#admin-topic-display")) {
            console.log("Div already exists, not adding again.");
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
          console.log("Created topic display div.");

          // Append the div to the homepage
          const homepageContainer = document.querySelector(
            "#ember3.discourse-root.ember-view"
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

              // Insert the content into the div
              topicDiv.innerHTML = content;
              console.log("Inserted topic content into the div.");
            })
            .catch((error) => {
              console.error("Error fetching topic content:", error);
              topicDiv.innerHTML = "<p>Error loading content</p>";
            });
        } else {
          // Remove the div if not on the homepage
          const existingDiv = document.querySelector("#admin-topic-display");
          if (existingDiv) {
            existingDiv.remove();
            console.log("Removed topic display div as it is not the homepage.");
          }
        }
      };

      // Initial check
      addDivToHomepage();

      // Check on each page change
      api.onPageChange((url, title) => {
        addDivToHomepage();
      });
    });
  },
};
