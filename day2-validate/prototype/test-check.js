// Checks that the rules give the expected suggestion for every sample case.
// Also checks the applicant message matches the format in the skill file.

var rules = require("./rules.js");
var check = require("./check.js");
var samples = require("./sample-applications.js");

var failures = 0;

samples.forEach(function (s) {
  var result = check.checkApplication(s, rules);
  var ok = result.suggestion === s.expected;
  if (!ok) failures++;
  console.log((ok ? "PASS " : "FAIL ") + s.id + "  expected: " + s.expected +
    "  got: " + result.suggestion + "  (" + s.note + ")");
});

var msg = check.applicantMessage("ICA1234", check.DECISIONS.MORE_INFO, ["Vaccination details of the child"]);
var expectedMsg = "Decision: More info needed\n\nFor your application id ICA1234, the following details are required:\n1. Vaccination details of the child";
if (msg !== expectedMsg) { failures++; console.log("FAIL message format:\n" + msg); }
else console.log("PASS message matches the skill-file example");

console.log(failures === 0 ? "\nAll checks passed." : "\n" + failures + " check(s) failed.");
process.exit(failures === 0 ? 0 : 1);
