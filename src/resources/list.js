/*
  Requirement: Populate the "Course Resources" list page.

  Instructions:
  1. Link this file to `list.html` using:
     <script src="list.js" defer></script>

  2. In `list.html`, add an `id="resource-list-section"` to the
     <section> element that will contain the resource articles.

  3. Implement the TODOs below.
*/

// --- Element Selections ---
// TODO: Select the section for the resource list ('#resource-list-section').
const listSection = document.getElementById("resource-list-section");

// --- Functions ---

/**
 * TODO: Implement the createResourceArticle function.
 * It takes one resource object {id, title, description}.
 * It should return an <article> element matching the structure in `list.html`.
 * The "View Resource & Discussion" link's `href` MUST be set to `details.html?id=${id}`.
 * (This is how the detail page will know which resource to load).
 */
function createResourceArticle(resource) {
  // Create elements for the article structure
  const { id, title, description } = resource;

  const article = document.createElement("article");

  const heading = document.createElement("h2");
  heading.textContent = title || "Untitled Resource";

  const desc = document.createElement("p");
  desc.textContent = description || "";

  const link = document.createElement("a");
  link.href = `details.html?id=${encodeURIComponent(id)}`;
  link.textContent = "View Resource & Discussion";

  article.appendChild(heading);
  article.appendChild(desc);
  article.appendChild(link);

  return article;
}

/**
 * TODO: Implement the loadResources function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use `fetch()` to get data from 'resources.json'.
 * 2. Parse the JSON response into an array.
 * 3. Clear any existing content from `listSection`.
 * 4. Loop through the resources array. For each resource:
 * - Call `createResourceArticle()`.
 * - Append the returned <article> element to `listSection`.
 */
async function loadResources() {
  try {
    const resp = await fetch("api/resources.json");
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const resources = await resp.json();

    // Clear existing content
    listSection.innerHTML = "";

    // Append each resource article
    if (Array.isArray(resources)) {
      resources.forEach((r) => {
        const article = createResourceArticle(r);
        listSection.appendChild(article);
      });
    } else {
      console.warn("resources.json did not return an array", resources);
    }
  } catch (err) {
    console.error("Failed to load resources:", err);
    listSection.innerHTML = "<p class=\"error\">Failed to load resources.</p>";
  }
}

// --- Initial Page Load ---
// Call the function to populate the page.
loadResources();
