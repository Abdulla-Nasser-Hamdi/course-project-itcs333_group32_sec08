/*
  Requirement: Populate the "Course Assignments" list page.

  Instructions:
  1. Link this file to `list.html` using:
     <script src="list.js" defer></script>

  2. In `list.html`, add an `id="assignment-list-section"` to the
     <section> element that will contain the assignment articles.

  3. Implement the TODOs below.
*/

// --- Element Selections ---
// TODO: Select the section for the assignment list ('#assignment-list-section').
let assignmentListSection = document.getElementById("assignment-list-section");

// --- Functions ---

/**
 * TODO: Implement the createAssignmentArticle function.
 * It takes one assignment object {id, title, dueDate, description}.
 * It should return an <article> element matching the structure in `list.html`.
 * The "View Details" link's `href` MUST be set to `details.html?id=${id}`.
 * This is how the detail page will know which assignment to load.
 */
function createAssignmentArticle(assignment) {
  let id = assignment.id;
  let title = assignment.title;
  let dueDate = assignment.dueDate;
  let description = assignment.description;

  let article = document.createElement("article");

  let titleElement = document.createElement("h2");
  titleElement.textContent = title;
  article.appendChild(titleElement);

  let dueElement = document.createElement("p");
  dueElement.textContent = `Due: ${dueDate}`;
  article.appendChild(dueElement);

  let descriptionElement = document.createElement("p");
  // Prepend "description: " for consistency with the HTML example
  descriptionElement.textContent = `description: ${description}`;
  article.appendChild(descriptionElement);

  let linkElement = document.createElement("a");
  linkElement.textContent = "View Details & Discussion";
  linkElement.href = `details.html?id=${id}`;
  linkElement.target = "_blank";
  article.appendChild(linkElement);

  return article;
}

/**
 * TODO: Implement the loadAssignments function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use `fetch()` to get data from 'assignments.json'.
 * 2. Parse the JSON response into an array.
 * 3. Clear any existing content from `assignmentListSection`.
 * 4. Loop through the assignments array. For each assignment:
 * - Call `createAssignmentArticle()`.
 * - Append the returned <article> element to `assignmentListSection`.
 */
async function loadAssignments() {
  // ... your implementation here ...
  if (!assignmentListSection) {
    return;
  }

  assignmentListSection.innerHTML = "";

  try {
    var response = await fetch("assignments.json");

    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }

    var assignments = await response.json();

    assignments.forEach(function (assignment) {
      var article = createAssignmentArticle(assignment);
      assignmentListSection.appendChild(article);
    });
  } catch (error) {
    var p = document.createElement("p");
    p.className = "error-message";
    p.textContent = "Error loading assignments. Please try again.";
    assignmentListSection.appendChild(p);
  }
}

// --- Initial Page Load ---
// Call the function to populate the page.
loadAssignments();
