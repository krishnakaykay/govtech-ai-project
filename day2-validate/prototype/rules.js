// Passport application rules for the prototype.
// Change the numbers here when ICA rules change. No other file needs editing.
// Rules come from day1-discover-define/skill-file.md.

var PASSPORT_RULES = {
  // Rule 1: for children, applications and renewals need vaccination details.
  childNeedsVaccination: true,

  // Rule 2: photo width and height must both be between these sizes, in pixels.
  photo: {
    minPixels: 300,
    maxPixels: 400,
    // The photo file must be smaller than this, in MB.
    maxFileSizeMB: 20
  }

  // Rule 3 (face must be visible) is checked in check.js.
};

if (typeof module !== "undefined") module.exports = PASSPORT_RULES;
