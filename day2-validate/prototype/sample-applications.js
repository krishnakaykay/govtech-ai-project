// Sample passport applications for the prototype.
// ALL DATA IS SYNTHETIC (made up). No real people, names, ID numbers or photos.
// Rules come from ../rulebook.md (made up) plus the group's own rules.
// "expected" is the suggestion the rules should give. It is used to test check.js.

function samplePhoto(extra) {
  var p = { width: 350, height: 350, sizeMB: 2, takenMonthsAgo: 1, background: "light blue",
    face: "visible", ears: "yes", glasses: "none", headgear: "none" };
  for (var k in extra) p[k] = extra[k];
  return p;
}

var SAMPLE_APPLICATIONS = [
  {
    id: "ICA1001", type: "renewal", applicant: "adult", age: 34, idCardProvided: true,
    photo: samplePhoto({}),
    expected: "Approved", note: "Adult renewal, everything complete"
  },
  {
    id: "ICA1234", type: "renewal", applicant: "child", age: 7,
    birthRecordProvided: true, guardianIdProvided: true, vaccinationProvided: false,
    photo: samplePhoto({ width: 320, height: 380, sizeMB: 1.5 }),
    expected: "More info needed", note: "Child renewal, no vaccination details"
  },
  {
    id: "ICA1003", type: "new", applicant: "child", age: 2,
    birthRecordProvided: true, guardianIdProvided: true, vaccinationProvided: true,
    photo: samplePhoto({ width: 400, height: 400, sizeMB: 3 }),
    expected: "Approved", note: "Child new application, everything complete"
  },
  {
    id: "ICA1004", type: "new", applicant: "adult", age: 25, idCardProvided: true,
    photo: samplePhoto({ width: 250, height: 250, sizeMB: 1 }),
    expected: "More info needed", note: "Photo too small"
  },
  {
    id: "ICA1005", type: "renewal", applicant: "adult", age: 41, idCardProvided: true,
    photo: samplePhoto({ takenMonthsAgo: 7, background: "white" }),
    expected: "More info needed", note: "Old photo with a white background"
  },
  {
    id: "ICA1006", type: "renewal", applicant: "adult", age: 58, idCardProvided: true,
    photo: samplePhoto({ glasses: "tinted" }),
    expected: "More info needed", note: "Tinted glasses in photo"
  },
  {
    id: "ICA1007", type: "renewal", applicant: "child", age: 10,
    birthRecordProvided: false, guardianIdProvided: true, vaccinationProvided: false,
    photo: samplePhoto({ width: 500, height: 500, sizeMB: 4 }),
    expected: "More info needed", note: "Child renewal, three problems"
  },
  {
    id: "ICA1008", type: "new", applicant: "adult", age: 29, idCardProvided: true,
    photo: samplePhoto({ headgear: "unclear" }),
    expected: "Escalated to officer", note: "Unclear if headgear is allowed"
  },
  {
    id: "ICA1009", type: "new", applicant: "child", age: 5,
    birthRecordProvided: true, guardianIdProvided: true, vaccinationProvided: false,
    photo: samplePhoto({ face: "unclear", ears: "unclear" }),
    expected: "Escalated to officer", note: "Missing vaccination and an unclear photo"
  }
];

if (typeof module !== "undefined") module.exports = SAMPLE_APPLICATIONS;
