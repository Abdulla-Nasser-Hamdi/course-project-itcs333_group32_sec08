let students = [];

const studentTableBody = document.querySelector("#student-table tbody");
const addStudentForm = document.getElementById("add-student-form");
const changePasswordForm = document.getElementById("password-form");
const searchInput = document.getElementById("search-input");
const tableHeaders = document.querySelectorAll("#student-table thead th");
// --- Functions ---

function createStudentRow(student) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${student.name}</td>
    <td>${student.id}</td>
    <td>${student.email}</td>
    <td>
      <button class="edit-btn" data-id="${student.id}">Edit</button>
      <button class="delete-btn secondary" data-id="${student.id}">Delete</button>
    </td>
  `;

  return tr;
}

function renderTable(studentArray) {
   studentTableBody.innerHTML = "";
   studentArray.forEach(student => {
    const row = createStudentRow(student);
    studentTableBody.appendChild(row);
  });
}

function handleChangePassword(event) {

  event.preventDefault();

  const current = document.getElementById("current-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (newPass !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  if (newPass.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  alert("Password updated successfully!");

  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
}

function handleAddStudent(event) {
   event.preventDefault();

  const name = document.getElementById("student-name").value.trim();
  const id = document.getElementById("student-id").value.trim();
  const email = document.getElementById("student-email").value.trim();

  if (!name || !id || !email) {
    alert("Please fill out all required fields.");
    return;
  }

  const exists = students.some(student => student.id === id);
  if (exists) {
    alert("Student with this ID already exists.");
    return;
  }

  students.push({ name, id, email });
  renderTable(students);

  document.getElementById("student-name").value = "";
  document.getElementById("student-id").value = "";
  document.getElementById("student-email").value = "";
  document.getElementById("default-password").value = "";
}

function handleTableClick(event) {
  // ... your implementation here ...
    if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    students = students.filter(student => student.id !== id);
    renderTable(students);
  }
}

/**
 * TODO: Implement the handleSearch function.
 * This function will be called on the "input" event of the `searchInput`.
 * It should:
 * 1. Get the search term from `searchInput.value` and convert it to lowercase.
 * 2. If the search term is empty, call `renderTable(students)` to show all students.
 * 3. If the search term is not empty:
 * - Filter the global 'students' array to find students whose name (lowercase)
 * includes the search term.
 * - Call `renderTable` with the *filtered array*.
 */
function handleSearch(event) {
  // ... your implementation here ...
    const term = searchInput.value.toLowerCase();

  if (term === "") {
    renderTable(students);
    return;
  }

  const filtered = students.filter(student =>
    student.name.toLowerCase().includes(term)
  );

  renderTable(filtered);
}

/**
 * TODO: Implement the handleSort function.
 * This function will be called when any `th` in the `thead` is clicked.
 * It should:
 * 1. Identify which column was clicked (e.g., `event.currentTarget.cellIndex`).
 * 2. Determine the property to sort by ('name', 'id', 'email') based on the index.
 * 3. Determine the sort direction. Use a data-attribute (e.g., `data-sort-dir="asc"`) on the `th`
 * to track the current direction. Toggle between "asc" and "desc".
 * 4. Sort the global 'students' array *in place* using `array.sort()`.
 * - For 'name' and 'email', use `localeCompare` for string comparison.
 * - For 'id', compare the values as numbers.
 * 5. Respect the sort direction (ascending or descending).
 * 6. After sorting, call `renderTable(students)` to update the view.
 */
function handleSort(event) {
  // ... your implementation here ...
    const index = event.currentTarget.cellIndex;

  const keyMap = {
    0: "name",
    1: "id",
    2: "email"
  };

  if (!(index in keyMap)) return;

  const key = keyMap[index];
  const currentDir = event.currentTarget.dataset.sortDir || "asc";
  const newDir = currentDir === "asc" ? "desc" : "asc";
  event.currentTarget.dataset.sortDir = newDir;

  students.sort((a, b) => {
    let result;

    if (key === "id") {
      result = Number(a[key]) - Number(b[key]);
    } else {
      result = a[key].localeCompare(b[key]);
    }

    return newDir === "asc" ? result : -result;
  });

  renderTable(students);

}

/**
 * TODO: Implement the loadStudentsAndInitialize function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use the `fetch()` API to get data from 'students.json'.
 * 2. Check if the response is 'ok'. If not, log an error.
 * 3. Parse the JSON response (e.g., `await response.json()`).
 * 4. Assign the resulting array to the global 'students' variable.
 * 5. Call `renderTable(students)` to populate the table for the first time.
 * 6. After data is loaded, set up all the event listeners:
 * - "submit" on `changePasswordForm` -> `handleChangePassword`
 * - "submit" on `addStudentForm` -> `handleAddStudent`
 * - "click" on `studentTableBody` -> `handleTableClick`
 * - "input" on `searchInput` -> `handleSearch`
 * - "click" on each header in `tableHeaders` -> `handleSort`
 */
async function loadStudentsAndInitialize() {
  // ... your implementation here ...
    try {
    const response = await fetch("students.json");

    if (!response.ok) {
      console.error("Failed to load students.json");
      return;
    }

    students = await response.json();
    renderTable(students);

    // Event listeners
    changePasswordForm.addEventListener("submit", handleChangePassword);
    addStudentForm.addEventListener("submit", handleAddStudent);
    studentTableBody.addEventListener("click", handleTableClick);
    searchInput.addEventListener("input", handleSearch);
    tableHeaders.forEach(th => th.addEventListener("click", handleSort));

  } catch (error) {
    console.error("Error loading students:", error);
  }
}

// --- Initial Page Load ---
// Call the main async function to start the application.
loadStudentsAndInitialize();
