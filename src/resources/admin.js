let resources = [];


const selctResource = document.getElementById('resource-form');


const resourcesTableBody = document.getElementById('resources-tbody');

// --- Functions ---


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


function renderTable() {
  
  resourcesTableBody.innerHTML = '';

  
  for (const resource of resources) {
    const row = createResourceRow(resource);
    resourcesTableBody.appendChild(row);
  }
}


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
