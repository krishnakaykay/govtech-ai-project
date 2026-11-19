// Passport application rules for the prototype.
// Change the numbers here when the rules change. Keep them the same as ../rulebook.md.
//
// The rulebook is MADE UP for the course. It is not ICA's real rules.
// The group's own rules (from day1-discover-define/skill-file.md) are added on top.

var PASSPORT_RULES = {
  // Made-up rulebook: the only application types these rules cover.
  // Any other type (such as a lost or damaged passport) is escalated to an officer.
  allowedTypes: ["new", "renewal"],

  // Made-up rulebook: a passport holder under this age is a child.
  childUnderAge: 14,

  // Group rule 1: for children, applications and renewals need vaccination details.
  childNeedsVaccination: true,

  photo: {
    // Group rule 2: width and height must both be between these sizes, in pixels.
    minPixels: 300,
    maxPixels: 400,
    // Group rule 2: the photo file must be smaller than this, in MB.
    maxFileSizeMB: 20,

    // Made-up rulebook: the photo must be taken within this many months.
    maxAgeMonths: 4,
    // Made-up rulebook: the background colour the photo must have.
    background: "light blue"
  }

  // Group rule 3 (face visible) and the made-up rules on ears, glasses
  // and headgear are checked in check.js.
};

if (typeof module !== "undefined") module.exports = PASSPORT_RULES;
