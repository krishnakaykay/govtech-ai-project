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

function isBlank(value) {
  return value === undefined || value === null || value === "";
}

function checkApplication(app, rules) {
  var required = [];    // details the applicant must fix
  var unclear = [];     // things the rules cannot decide, sent to an officer
  var unclearAsk = [];  // the same things, worded as a request the officer can send
  var issues = [];      // every problem, with the form field it belongs to

  function need(field, text) {
    required.push(text);
    issues.push({ field: field, text: text, level: "fix" });
  }

  function notSure(field, forOfficer, forApplicant) {
    unclear.push(forOfficer);
    unclearAsk.push(forApplicant);
    issues.push({ field: field, text: forApplicant, level: "check" });
  }

  // Who counts as a child (made-up rulebook).
  var isChild;
  if (isNumber(app.age) && (app.age < 0 || app.age > 120 || Math.floor(app.age) !== app.age)) {
    need("age", "An age between 0 and 120, in whole years");
    isChild = app.applicant === "child";
  } else if (isNumber(app.age)) {
    isChild = app.age < rules.childUnderAge;
  } else {
    need("age", "The date of birth of the passport holder");
    isChild = app.applicant === "child";
  }

  // Documents (made-up rulebook, plus group rule 1).
  if (isChild) {
    if (!app.birthRecordProvided) need("birthRecord", "The child's birth record");
    if (!app.guardianIdProvided) need("guardianId", "The identity card of a consenting parent or guardian");
    if (rules.childNeedsVaccination && !app.vaccinationProvided) need("vaccination", "Vaccination details of the child");
  } else if (!app.idCardProvided) {
    need("idCard", "A copy of the passport holder's identity card");
  }

  var photo = app.photo;
  if (!photo) {
    need("photo", "A passport photo");
  } else {
    // Group rule 2: photo size in pixels and file size.
    var min = rules.photo.minPixels;
    var max = rules.photo.maxPixels;
    if (!isNumber(photo.width) || !isNumber(photo.height)) {
      need("photoSize", "The width and height of the photo, in pixels");
    } else if (photo.width < min || photo.width > max || photo.height < min || photo.height > max) {
      need("photoSize", "A photo between " + min + " and " + max + " pixels wide and high (yours is " +
        photo.width + " × " + photo.height + ")");
    }

    var maxMB = rules.photo.maxFileSizeMB;
    if (!isNumber(photo.sizeMB)) {
      need("photoFile", "The file size of the photo");
    } else if (photo.sizeMB <= 0) {
      need("photoFile", "A photo file larger than 0 MB");
    } else if (photo.sizeMB >= maxMB) {
      need("photoFile", "A photo file smaller than " + maxMB + " MB (yours is " + photo.sizeMB + " MB)");
    }

    // Made-up rulebook: when the photo was taken.
    var months = rules.photo.maxAgeMonths;
    if (!isNumber(photo.takenMonthsAgo)) {
      need("photoDate", "When the photo was taken");
    } else if (photo.takenMonthsAgo > months) {
      need("photoDate", "A photo taken in the last " + months + " months");
    }

    // Made-up rulebook: background colour.
    if (isBlank(photo.background)) {
      need("background", "Tell us the background colour of the photo");
    } else if (photo.background !== rules.photo.background) {
      need("background", "A photo with a plain " + rules.photo.background + " background");
    }

    // Group rule 3: the face must be visible.
    if (isBlank(photo.face)) {
      need("face", "Tell us if the face is fully visible in the photo");
    } else if (photo.face === "covered") {
      need("face", "A photo where the face is fully visible");
    } else if (photo.face !== "visible") {
      notSure("face", "The rules cannot tell if the face is visible in the photo",
        "A photo where the face is fully visible");
    }

    // Made-up rulebook: both ears visible.
    if (isBlank(photo.ears)) {
      need("ears", "Tell us if both ears are visible in the photo");
    } else if (photo.ears === "no") {
      need("ears", "A photo where both ears are visible");
    } else if (photo.ears !== "yes") {
      notSure("ears", "The rules cannot tell if both ears are visible in the photo",
        "A photo where both ears are visible");
    }

    // Made-up rulebook: no tinted glasses or sunglasses.
    if (isBlank(photo.glasses)) {
      need("glasses", "Tell us if glasses are worn in the photo");
    } else if (photo.glasses === "tinted") {
      need("glasses", "A photo without tinted glasses or sunglasses");
    } else if (photo.glasses !== "none" && photo.glasses !== "clear") {
      notSure("glasses", "The rules cannot tell what glasses are worn in the photo",
        "A photo without tinted glasses or sunglasses");
    }

    // Made-up rulebook: headgear only if worn every day, with the full face visible.
    if (isBlank(photo.headgear)) {
      need("headgear", "Tell us if headgear is worn in the photo");
    } else if (photo.headgear === "covers-face") {
      need("headgear", "A photo where headgear does not cover any part of the face from chin to forehead");
    } else if (photo.headgear === "not-daily") {
      need("headgear", "A photo without headgear. Headgear is allowed only if it is worn every day");
    } else if (photo.headgear !== "none" && photo.headgear !== "daily-face-visible") {
      notSure("headgear", "The rules cannot tell if the headgear is allowed",
        "A photo without headgear, or with headgear worn every day that does not cover the face");
    }
  }

  // Ambiguity always goes to an officer, as the skill file says.
  var suggestion;
  if (unclear.length > 0) suggestion = DECISIONS.ESCALATED;
  else if (required.length > 0) suggestion = DECISIONS.MORE_INFO;
  else suggestion = DECISIONS.APPROVED;

  return { suggestion: suggestion, required: required, unclear: unclear, unclearAsk: unclearAsk,
    issues: issues, isChild: isChild };
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
