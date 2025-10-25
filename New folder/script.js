document.addEventListener("DOMContentLoaded", () => {
  // Get all the important elements from the HTML
  const newNoteBtn = document.getElementById("newNoteBtn");
  const noteContent = document.getElementById("noteContent");
  const deleteNoteBtn = document.getElementById("deleteNoteBtn");
  const themeToggle = document.getElementById("themeToggle");
  const noteTitle = document.getElementById("noteTitle");
  const notesList = document.getElementById("notesList");

  // Load initial state when the page opens
  loadTheme();
  loadNotesList();
  resetEditor();

  // Add event listeners
  newNoteBtn.addEventListener("click", createNote);
  noteContent.addEventListener("input", saveNote);
  deleteNoteBtn.addEventListener("click", deleteNote);
  themeToggle.addEventListener("click", toggleDarkMode);
});

// --- Core Data Functions (helpers) ---

function getNotes() {
  // Get all notes from Local Storage, or an empty object if none exist
  return JSON.parse(localStorage.getItem("notes")) || {};
}

function saveNotes(notes) {
  // Save the notes object back to Local Storage
  localStorage.setItem("notes", JSON.stringify(notes));
}

function getCurrentNote() {
  // Get the name of the currently active note
  return localStorage.getItem("currentNote");
}

function setCurrentNote(name) {
  // Set the name of the currently active note
  localStorage.setItem("currentNote", name);
}

function clearCurrentNote() {
  // Clear the active note
  localStorage.removeItem("currentNote");
}

// --- Note Actions ---

function createNote() {
  const noteName = prompt("Enter note name:");
  if (!noteName || noteName.trim() === "") return; // User cancelled or entered empty name

  const notes = getNotes();
  if (notes[noteName]) {
    alert("Note name already exists!");
    return;
  }

  notes[noteName] = ""; // Create a new empty note
  saveNotes(notes);
  loadNotesList();
  loadNote(noteName); // Automatically load the new note
}

function loadNotesList() {
  const notes = getNotes();
  notesList.innerHTML = ""; // Clear the old list

  // Create a button for each note
  for (let name in notes) {
    const btn = document.createElement("button");
    btn.textContent = name;
    // When a note button is clicked, load that note
    btn.onclick = () => loadNote(name);
    notesList.appendChild(btn);
  }
}

function loadNote(name) {
  const notes = getNotes();
  if (notes[name] === undefined) {
    // This should not happen if called from loadNotesList, but good to check
    resetEditor();
    return;
  }
  
  // Update the editor with the note's content
  noteTitle.textContent = name;
  noteContent.value = notes[name];
  deleteNoteBtn.style.display = "block"; // Show the delete button
  noteContent.disabled = false; // Enable the text area
  setCurrentNote(name);
}

function saveNote() {
  const current = getCurrentNote();
  if (!current) return; // No note is active, do nothing

  const notes = getNotes();
  const text = noteContent.value;
  notes[current] = text; // Update the note content
  saveNotes(notes);
}

function deleteNote() {
  const current = getCurrentNote();
  if (!current) return;

  // Ask for confirmation before deleting
  if (!confirm(`Are you sure you want to delete "${current}"?`)) {
    return;
  }

  const notes = getNotes();
  delete notes[current]; // Remove the note
  saveNotes(notes);
  clearCurrentNote();
  loadNotesList(); // Refresh the sidebar
  resetEditor(); // Reset the editor to its default state
}

function resetEditor() {
  // Set the editor to its default "no note selected" state
  noteTitle.textContent = "Select or Create a Note";
  noteContent.value = "";
  noteContent.disabled = true; // Disable the text area
  deleteNoteBtn.style.display = "none"; // Hide the delete button
  clearCurrentNote();
}

// --- Theme Functions ---

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
}