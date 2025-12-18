
const listSection = document.getElementById("resource-list-section");

// --- Functions ---

function createResourceArticle(resource) {
  
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


async function loadResources() {
  try {
    const resp = await fetch("api/resources.json");
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const resources = await resp.json();

    
    listSection.innerHTML = "";

    
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
