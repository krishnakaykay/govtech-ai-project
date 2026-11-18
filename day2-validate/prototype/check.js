// Plain rule checks for one passport application. No AI.
// Follows ../rulebook.md (made up) plus the group's own rules.
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
  var required = [];    // details the applicant must fix
  var unclear = [];     // things the rules cannot decide, sent to an officer
  var unclearAsk = [];  // the same things, worded as a request the officer can send

  function notSure(forOfficer, forApplicant) {
    unclear.push(forOfficer);
    unclearAsk.push(forApplicant);
  }

  // Who counts as a child (made-up rulebook).
  var isChild;
  if (isNumber(app.age)) {
    isChild = app.age < rules.childUnderAge;
  } else {
    required.push("The age of the passport holder");
    isChild = app.applicant === "child";
  }

  // Documents (made-up rulebook, plus group rule 1).
  if (isChild) {
    if (!app.birthRecordProvided) required.push("The child's birth record");
    if (!app.guardianIdProvided) required.push("The identity card of a consenting parent or guardian");
    if (rules.childNeedsVaccination && !app.vaccinationProvided) required.push("Vaccination details of the child");
  } else if (!app.idCardProvided) {
    required.push("A copy of the passport holder's identity card");
  }

  var photo = app.photo;
  if (!photo) {
    required.push("A passport photo");
  } else {
    // Group rule 2: photo size in pixels and file size.
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

    // Made-up rulebook: when the photo was taken.
    var months = rules.photo.maxAgeMonths;
    if (!isNumber(photo.takenMonthsAgo)) {
      required.push("When the photo was taken");
    } else if (photo.takenMonthsAgo > months) {
      required.push("A photo taken in the last " + months + " months");
    }

    // Made-up rulebook: background colour.
    if (photo.background !== rules.photo.background) {
      required.push("A photo with a plain " + rules.photo.background + " background");
    }

    // Group rule 3: the face must be visible.
    if (photo.face === "covered") {
      required.push("A photo where the face is fully visible");
    } else if (photo.face !== "visible") {
      notSure("The rules cannot tell if the face is visible in the photo",
        "A photo where the face is fully visible");
    }

    // Made-up rulebook: both ears visible.
    if (photo.ears === "no") {
      required.push("A photo where both ears are visible");
    } else if (photo.ears !== "yes") {
      notSure("The rules cannot tell if both ears are visible in the photo",
        "A photo where both ears are visible");
    }

    // Made-up rulebook: no tinted glasses or sunglasses.
    if (photo.glasses === "tinted") {
      required.push("A photo without tinted glasses or sunglasses");
    } else if (photo.glasses !== "none" && photo.glasses !== "clear") {
      notSure("The rules cannot tell what glasses are worn in the photo",
        "A photo without tinted glasses or sunglasses");
    }

    // Made-up rulebook: headgear only if worn every day, with the full face visible.
    if (photo.headgear === "covers-face") {
      required.push("A photo where headgear does not cover any part of the face from chin to forehead");
    } else if (photo.headgear === "not-daily") {
      required.push("A photo without headgear. Headgear is allowed only if it is worn every day");
    } else if (photo.headgear !== "none" && photo.headgear !== "daily-face-visible") {
      notSure("The rules cannot tell if the headgear is allowed",
        "A photo without headgear, or with headgear worn every day that does not cover the face");
    }
  }

  // Ambiguity always goes to an officer, as the skill file says.
  var suggestion;
  if (unclear.length > 0) suggestion = DECISIONS.ESCALATED;
  else if (required.length > 0) suggestion = DECISIONS.MORE_INFO;
  else suggestion = DECISIONS.APPROVED;

  return { suggestion: suggestion, required: required, unclear: unclear, unclearAsk: unclearAsk, isChild: isChild };
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
