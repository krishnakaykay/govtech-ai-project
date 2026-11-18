// Shared storage for the two pages: the public page and the officer page.
// Data is kept in this browser only (localStorage). Nothing is sent anywhere.
// All data is synthetic.

var STORE_KEY = "passport-prototype-v1";

function loadStore() {
  try {
    var data = JSON.parse(localStorage.getItem(STORE_KEY));
    if (data && data.queue && data.outbox) return data;
  } catch (e) { /* start fresh */ }
  return { queue: [], outbox: [], nextId: 2001 };
}

// Demo only: when true, the next saves fail on purpose, to show the unhappy path.
var FORCE_SAVE_FAILURE = false;

// Returns true if saved, false if not. Callers must tell the user when it fails.
function saveStore(data) {
  try {
    if (FORCE_SAVE_FAILURE) throw new Error("Forced failure (demo)");
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

function clearStore() {
  localStorage.removeItem(STORE_KEY);
}

// Small helpers used by both pages.
function el(id) { return document.getElementById(id); }

// Build an element with safe text (no HTML from user input).
function make(tag, text, className) {
  var node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = text;
  if (className) node.className = className;
  return node;
}
