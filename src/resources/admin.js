/*
  Requirement: Make the "Manage Resources" page interactive.

  Instructions:
  1. Link this file to `admin.html` using:
     <script src="admin.js" defer></script>
  
  2. In `admin.html`, add an `id="resources-tbody"` to the <tbody> element
     inside your `resources-table`.
  
  3. Implement the TODOs below.
*/

// --- Global Data Store ---
// This will hold the resources loaded from the JSON file.
let resources = [];

// --- Element Selections ---
// TODO: Select the resource form ('#resource-form').
const selctResource = document.getElementById('resource-form');

// TODO: Select the resources table body ('#resources-tbody').
const resourcesTableBody = document.getElementById('resources-tbody');

// --- Functions ---

/**
 * TODO: Implement the createResourceRow function.
 * It takes one resource object {id, title, description}.
 * It should return a <tr> element with the following <td>s:
 * 1. A <td> for the `title`.
 * 2. A <td> for the `description`.
 * 3. A <td> containing two buttons:
 * - An "Edit" button with class "edit-btn" and `data-id="${id}"`.
 * - A "Delete" button with class "delete-btn" and `data-id="${id}"`.
 */
function createResourceRow(resource) {
  
  const tr = document.createElement('tr');

  
  const titleTd = document.createElement('td');
  titleTd.textContent = resource.title || '';
  tr.appendChild(titleTd);

  
  const descTd = document.createElement('td');
  descTd.textContent = resource.description || '';
  tr.appendChild(descTd);

  
  const actionsTd = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.setAttribute('data-id', resource.id);
  editBtn.type = 'button';
  editBtn.textContent = 'Edit';
  actionsTd.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('data-id', resource.id);
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';
  actionsTd.appendChild(deleteBtn);

  tr.appendChild(actionsTd);

  return tr;
  
}

/**
 * TODO: Implement the renderTable function.
 * It should:
 * 1. Clear the `resourcesTableBody`.
 * 2. Loop through the global `resources` array.
 * 3. For each resource, call `createResourceRow()`, and
 * append the resulting <tr> to `resourcesTableBody`.
 */
function renderTable() {
  // Clear the table body
  resourcesTableBody.innerHTML = '';

  // Loop through resources and append each row
  for (const resource of resources) {
    const row = createResourceRow(resource);
    resourcesTableBody.appendChild(row);
  }
}

/**
 * TODO: Implement the handleAddResource function.
 * This is the event handler for the form's 'submit' event.
 * It should:
 * 1. Prevent the form's default submission.
 * 2. Get the values from the title, description, and link inputs.
 * 3. Create a new resource object with a unique ID (e.g., `id: \`res_${Date.now()}\``).
 * 4. Add this new resource object to the global `resources` array (in-memory only).
 * 5. Call `renderTable()` to refresh the list.
 * 6. Reset the form.
 */
function handleAddResource(event) {

  
  event.preventDefault();

  
  const titleInput = document.getElementById('resource-title');
  const descInput = document.getElementById('resource-description');
  const linkInput = document.getElementById('resource-link');

  const title = titleInput ? titleInput.value.trim() : '';
  const description = descInput ? descInput.value.trim() : '';
  const link = linkInput ? linkInput.value.trim() : '';

  
  if (!title || !link) {
   
    return;
  }

  
  const newResource = {
    id: `res_${Date.now()}`,
    title,
    description,
    link,
  };

  
  resources.push(newResource);

  
  renderTable();

  
  if (selctResource && selctResource.reset) {
    selctResource.reset();
  }
}

/**
 * TODO: Implement the handleTableClick function.
 * This is an event listener on the `resourcesTableBody` (for delegation).
 * It should:
 * 1. Check if the clicked element (`event.target`) has the class "delete-btn".
 * 2. If it does, get the `data-id` attribute from the button.
 * 3. Update the global `resources` array by filtering out the resource
 * with the matching ID (in-memory only).
 * 4. Call `renderTable()` to refresh the list.
 */
function handleTableClick(event) {
  
  const btn = event.target.closest('button');
  if (!btn) return;


  if (btn.classList.contains('delete-btn')) {
    const id = btn.getAttribute('data-id');
    if (!id) return;

    
    resources = resources.filter((r) => r.id !== id);

    
    renderTable();
    return;
  }

  
}

/**
 * TODO: Implement the loadAndInitialize function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use `fetch()` to get data from 'resources.json'.
 * 2. Parse the JSON response and store the result in the global `resources` array.
 * 3. Call `renderTable()` to populate the table for the first time.
 * 4. Add the 'submit' event listener to `resourceForm` (calls `handleAddResource`).
 * 5. Add the 'click' event listener to `resourcesTableBody` (calls `handleTableClick`).
 */
async function loadAndInitialize() {
  try {
    const resp = await fetch('api/resources.json');
    if (!resp.ok) {
      console.warn('Failed to fetch resources.json:', resp.status, resp.statusText);
      resources = [];
    } else {
      const data = await resp.json();
      resources = Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.warn('Error fetching resources.json:', err);
    resources = [];
  }

  
  renderTable();

  
  if (selctResource) {
    selctResource.addEventListener('submit', handleAddResource);
  } else {
    console.warn('Resource form element not found.');
  }

  if (resourcesTableBody) {
    resourcesTableBody.addEventListener('click', handleTableClick);
  } else {
    console.warn('Resources table body not found.');
  }
}

// --- Initial Page Load ---
// Call the main async function to start the application.
loadAndInitialize();
