// Tests the riskiest assumption in ../build-log.md:
// "Fewer than 0.0001% of approved passport applications are approved wrongly."
//
// Part 1 of the test: do the rules ever SUGGEST "Approved" for an application
// that should not be approved? Uses approval-test-cases.js (all made up).
//
// Run it with:  node test-false-approvals.js
//
// Kill switch for this part: any wrong "Approved" suggestion in a case the rules can see.
// Cases where the applicant typed something untrue are counted separately.
// The rules cannot see those, so an officer must catch them (part 2, done by people).

var rules = require("./rules.js");
var check = require("./check.js");
var cases = require("./approval-test-cases.js");

var SELF_REPORT = "Wrong self-report";

var counts = { cases: cases.length, shouldApprove: 0, shouldNotApprove: 0,
  falseApprovals: 0, selfReportCases: 0, selfReportApproved: 0, wronglyHeldBack: 0 };
var falseApprovals = [];
var byGroup = {};

cases.forEach(function (c) {
  var result = check.checkApplication(c, rules);
  var suggestedApprove = result.suggestion === check.DECISIONS.APPROVED;
  var selfReport = c.group.indexOf(SELF_REPORT) === 0;

  var g = byGroup[c.group] || (byGroup[c.group] = { total: 0, approved: 0, shouldApprove: c.shouldApprove });
  g.total++;
  if (suggestedApprove) g.approved++;

  if (c.shouldApprove) {
    counts.shouldApprove++;
    if (!suggestedApprove) counts.wronglyHeldBack++;
  } else {
    counts.shouldNotApprove++;
    if (selfReport) {
      counts.selfReportCases++;
      if (suggestedApprove) counts.selfReportApproved++;
    } else if (suggestedApprove) {
      counts.falseApprovals++;
      falseApprovals.push(c.id + " (" + c.group + ")");
    }
  }
});

console.log("FALSE-APPROVAL TEST · all data is made up\n");
console.log("Cases by group (how many the rules suggested Approved):");
Object.keys(byGroup).forEach(function (name) {
  var g = byGroup[name];
  var want = g.shouldApprove ? "should be Approved" : "should NOT be Approved";
  console.log("  " + name + ": " + g.approved + " of " + g.total + " suggested Approved (" + want + ")");
});

var visibleBad = counts.shouldNotApprove - counts.selfReportCases;
console.log("\nResult");
console.log("  Wrong 'Approved' suggestions the rules could have caught: " +
  counts.falseApprovals + " of " + visibleBad + "   (kill switch: more than 0)");
if (falseApprovals.length) console.log("    " + falseApprovals.join(", "));
console.log("  Good applications held back by mistake: " + counts.wronglyHeldBack + " of " + counts.shouldApprove);
console.log("  Untrue answers the rules cannot see: " + counts.selfReportApproved + " of " +
  counts.selfReportCases + " suggested Approved. An officer must catch these.");

var pass = counts.falseApprovals === 0;
console.log("\n" + (pass
  ? "PASS: no wrong Approved suggestions in cases the rules can see."
  : "KILL SWITCH: the rules suggested Approved for an application that should not pass."));
console.log("This does not prove 0.0001%. Showing a rate that low would need about 3 million error-free cases.");

process.exit(pass ? 0 : 1);
