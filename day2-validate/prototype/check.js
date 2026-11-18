// Plain rule checks for one passport application. No AI.
// The result is only a suggestion. ICA officers make every final decision.

var DECISIONS = {
  APPROVED: "Approved",
  ESCALATED: "Escalated to officer",
  MORE_INFO: "More info needed"
};

function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

function checkApplication(app, rules) {
  var required = [];   // details the applicant must fix
  var unclear = [];    // things the rules cannot decide, sent to an officer

  // Rule 1: children need vaccination details.
  if (app.applicant === "child" && rules.childNeedsVaccination && !app.vaccinationProvided) {
    required.push("Vaccination details of the child");
  }

  var photo = app.photo;
  if (!photo) {
    required.push("A passport photo");
  } else {
    // Rule 2: photo size in pixels and file size.
    var min = rules.photo.minPixels;
    var max = rules.photo.maxPixels;
    if (!isNumber(photo.width) || !isNumber(photo.height)) {
      required.push("The width and height of the photo, in pixels");
    } else if (photo.width < min || photo.width > max || photo.height < min || photo.height > max) {
      required.push("A photo between " + min + " and " + max + " pixels wide and high (yours is " +
        photo.width + " × " + photo.height + ")");
    }

    var maxMB = rules.photo.maxFileSizeMB;
    if (!isNumber(photo.sizeMB)) {
      required.push("The file size of the photo");
    } else if (photo.sizeMB >= maxMB) {
      required.push("A photo file smaller than " + maxMB + " MB (yours is " + photo.sizeMB + " MB)");
    }

    // Rule 3: the face must be visible.
    if (photo.face === "covered") {
      required.push("A photo where the face is fully visible");
    } else if (photo.face !== "visible") {
      unclear.push("The rules cannot tell if the face is visible in the photo");
    }
  }

  // Ambiguity always goes to an officer, as the skill file says.
  var suggestion;
  if (unclear.length > 0) suggestion = DECISIONS.ESCALATED;
  else if (required.length > 0) suggestion = DECISIONS.MORE_INFO;
  else suggestion = DECISIONS.APPROVED;

  return { suggestion: suggestion, required: required, unclear: unclear };
}

// The reply to the applicant. Uses the application ID only, never personal details.
function applicantMessage(applicationId, decision, details) {
  if (decision === DECISIONS.APPROVED) {
    return "Decision: Approved\n\nYour application id " + applicationId + " has been approved.";
  }
  var lines = details.map(function (d, i) { return (i + 1) + ". " + d; });
  return "Decision: " + DECISIONS.MORE_INFO + "\n\nFor your application id " + applicationId +
    ", the following details are required:\n" + lines.join("\n");
}

if (typeof module !== "undefined") {
  module.exports = { checkApplication: checkApplication, applicantMessage: applicantMessage, DECISIONS: DECISIONS };
}
