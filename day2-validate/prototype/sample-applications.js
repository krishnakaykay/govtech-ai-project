// Sample passport applications for the prototype.
// ALL DATA IS SYNTHETIC (made up). No real people, names, NRIC numbers or photos.
// "expected" is the suggestion the rules should give. It is used to test check.js.

var SAMPLE_APPLICATIONS = [
  {
    id: "ICA1001", type: "renewal", applicant: "adult", vaccinationProvided: false,
    photo: { width: 350, height: 350, sizeMB: 2, face: "visible" },
    expected: "Approved", note: "Adult renewal, everything complete"
  },
  {
    id: "ICA1234", type: "renewal", applicant: "child", vaccinationProvided: false,
    photo: { width: 320, height: 380, sizeMB: 1.5, face: "visible" },
    expected: "More info needed", note: "Child renewal, no vaccination details"
  },
  {
    id: "ICA1003", type: "new", applicant: "child", vaccinationProvided: true,
    photo: { width: 400, height: 400, sizeMB: 3, face: "visible" },
    expected: "Approved", note: "Child new application, everything complete"
  },
  {
    id: "ICA1004", type: "new", applicant: "adult", vaccinationProvided: false,
    photo: { width: 250, height: 250, sizeMB: 1, face: "visible" },
    expected: "More info needed", note: "Photo too small"
  },
  {
    id: "ICA1005", type: "renewal", applicant: "adult", vaccinationProvided: false,
    photo: { width: 360, height: 380, sizeMB: 25, face: "visible" },
    expected: "More info needed", note: "Photo file 20 MB or more"
  },
  {
    id: "ICA1006", type: "renewal", applicant: "adult", vaccinationProvided: false,
    photo: { width: 350, height: 350, sizeMB: 2, face: "covered" },
    expected: "More info needed", note: "Face covered in photo"
  },
  {
    id: "ICA1007", type: "renewal", applicant: "child", vaccinationProvided: false,
    photo: { width: 500, height: 500, sizeMB: 4, face: "visible" },
    expected: "More info needed", note: "Child renewal, two problems"
  },
  {
    id: "ICA1008", type: "new", applicant: "adult", vaccinationProvided: false,
    photo: { width: 340, height: 360, sizeMB: 2, face: "unclear" },
    expected: "Escalated to officer", note: "Unclear if face is visible"
  },
  {
    id: "ICA1009", type: "new", applicant: "child", vaccinationProvided: false,
    photo: { width: 300, height: 300, sizeMB: 19.9, face: "unclear" },
    expected: "Escalated to officer", note: "Missing vaccination and unclear photo"
  }
];

if (typeof module !== "undefined") module.exports = SAMPLE_APPLICATIONS;
