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

  // Application type (made-up rulebook). Only the listed types are covered.
  if (isBlank(app.type)) {
    need("type", "Choose whether this is a new passport or a renewal.");
  } else if (rules.allowedTypes && rules.allowedTypes.indexOf(app.type) < 0) {
    notSure("type", "The rules do not cover this type of application (" + app.type + ")",
      "We need to check this type of application by hand. An officer will tell you what to send.");
  }

  // Who counts as a child (made-up rulebook).
  var isChild;
  if (isNumber(app.age) && (app.age < 0 || app.age > 120 || Math.floor(app.age) !== app.age)) {
    need("age", "Check the age. Enter it in whole years, from 0 to 120.");
    isChild = app.applicant === "child";
  } else if (isNumber(app.age)) {
    isChild = app.age < rules.childUnderAge;
  } else {
    need("age", "Enter the age of the person the passport is for.");
    isChild = app.applicant === "child";
  }

  // Documents (made-up rulebook, plus group rule 1).
  if (isChild) {
    if (!app.birthRecordProvided) need("birthRecord", "Send your child's birth record.");
    if (!app.guardianIdProvided) need("guardianId", "Send the identity card of a parent or guardian who agrees to this application.");
    if (rules.childNeedsVaccination && !app.vaccinationProvided) need("vaccination", "Send your child's vaccination record.");
  } else if (!app.idCardProvided) {
    need("idCard", "Send a copy of your identity card.");
  }

  var photo = app.photo;
  if (!photo) {
    need("photo", "Add a passport photo.");
  } else {
    // Group rule 2: photo size in pixels and file size.
    var min = rules.photo.minPixels;
    var max = rules.photo.maxPixels;
    if (!isNumber(photo.width) || !isNumber(photo.height)) {
      need("photoSize", "Enter the width and height of the photo, in pixels.");
    } else if (photo.width < min || photo.width > max || photo.height < min || photo.height > max) {
      var small = photo.width < min || photo.height < min;
      var big = photo.width > max || photo.height > max;
      var how = small && !big ? "too small" : big && !small ? "too big" : "the wrong size";
      need("photoSize", "The photo is " + how + " (" + photo.width + " × " + photo.height + " pixels). Send one that is " +
        min + " to " + max + " pixels wide and " + min + " to " + max + " pixels high.");
    }

    var maxMB = rules.photo.maxFileSizeMB;
    if (!isNumber(photo.sizeMB)) {
      need("photoFile", "Enter the file size of the photo.");
    } else if (photo.sizeMB <= 0) {
      need("photoFile", "The photo file is empty. Send the photo again.");
    } else if (photo.sizeMB >= maxMB) {
      need("photoFile", "The photo file is too large (" + photo.sizeMB + " MB). Send a smaller file, under " + maxMB + " MB.");
    }

    // Made-up rulebook: when the photo was taken.
    var months = rules.photo.maxAgeMonths;
    if (!isNumber(photo.takenMonthsAgo)) {
      need("photoDate", "Enter how many months ago the photo was taken.");
    } else if (photo.takenMonthsAgo > months) {
      need("photoDate", "The photo is too old. Send one taken in the last " + months + " months.");
    }

    // Made-up rulebook: background colour.
    if (isBlank(photo.background)) {
      need("background", "Tell us the background colour of the photo.");
    } else if (photo.background !== rules.photo.background) {
      need("background", "Send a photo with a plain " + rules.photo.background + " background.");
    }

    // Group rule 3: the face must be visible.
    if (isBlank(photo.face)) {
      need("face", "Tell us if the whole face can be seen in the photo.");
    } else if (photo.face === "covered") {
      need("face", "Send a photo where nothing covers the face.");
    } else if (photo.face !== "visible") {
      notSure("face", "The rules cannot tell if the face is visible in the photo",
        "Send a clear photo where the whole face can be seen.");
    }

    // Made-up rulebook: both ears visible.
    if (isBlank(photo.ears)) {
      need("ears", "Tell us if both ears can be seen in the photo.");
    } else if (photo.ears === "no") {
      need("ears", "Send a photo where both ears can be seen.");
    } else if (photo.ears !== "yes") {
      notSure("ears", "The rules cannot tell if both ears are visible in the photo",
        "Send a clear photo where both ears can be seen.");
    }

    // Made-up rulebook: no tinted glasses or sunglasses.
    if (isBlank(photo.glasses)) {
      need("glasses", "Tell us if glasses are worn in the photo.");
    } else if (photo.glasses === "tinted") {
      need("glasses", "Send a photo without sunglasses or tinted glasses. Clear glasses are fine.");
    } else if (photo.glasses !== "none" && photo.glasses !== "clear") {
      notSure("glasses", "The rules cannot tell what glasses are worn in the photo",
        "Send a photo without sunglasses or tinted glasses. Clear glasses are fine.");
    }

    // Made-up rulebook: headgear only if worn every day, with the full face visible.
    if (isBlank(photo.headgear)) {
      need("headgear", "Tell us if headgear is worn in the photo.");
    } else if (photo.headgear === "covers-face") {
      need("headgear", "Send a photo where the headgear does not cover any part of the face, from chin to forehead.");
    } else if (photo.headgear === "not-daily") {
      need("headgear", "Send a photo without headgear. Headgear is only allowed if it is worn every day.");
    } else if (photo.headgear !== "none" && photo.headgear !== "daily-face-visible") {
      notSure("headgear", "The rules cannot tell if the headgear is allowed",
        "Send a new photo. If headgear is worn every day, it must not cover any part of the face, from chin to forehead. If not, send a photo without headgear.");
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
