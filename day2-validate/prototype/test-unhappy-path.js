// Tests the unhappy path, including one forced failure. All data is made up.
//
// Forced failure: saving is made to fail on purpose while an applicant submits.
// Expected: the applicant is told it did not go through, nothing they typed is lost,
// nothing reaches the officer, and "Try again" works once the system is back.
//
// Also checks: impossible ages, a 0 MB photo, and the same application submitted twice.

var fs = require("fs");
var vm = require("vm");
var dir = __dirname;

// A stand-in for the browser, so the real page code can run here.
var storage = {};
var localStorage = {
  getItem: function (k) { return k in storage ? storage[k] : null; },
  setItem: function (k, v) { storage[k] = String(v); },
  removeItem: function (k) { delete storage[k]; }
};
function Node(tag) {
  this.tag = tag; this.children = []; this._t = ""; this.value = ""; this.checked = false;
  this.style = {}; this.className = "";
  var self = this;
  this.classList = {
    toggle: function (c, on) {
      var t = self.className.split(" ").filter(Boolean);
      var has = t.indexOf(c) >= 0;
      if (on === undefined) on = !has;
      if (on && !has) t.push(c);
      if (!on && has) t.splice(t.indexOf(c), 1);
      self.className = t.join(" ");
    },
    add: function (c) { this.toggle(c, true); },
    remove: function (c) { this.toggle(c, false); },
    contains: function (c) { return self.className.split(" ").indexOf(c) >= 0; }
  };
}
Node.prototype = {
  appendChild: function (c) { this.children.push(c); return c; },
  set textContent(t) { this._t = String(t); this.children = []; },
  get textContent() { return [this._t].concat(this.children.map(function (c) { return c.textContent; })).join(" ").trim(); },
  set innerHTML(h) { this.children = []; this._t = ""; },
  querySelectorAll: function (sel) {
    var r = [];
    (function walk(n) { n.children.forEach(function (c) { if (c.tag === sel) r.push(c); walk(c); }); })(this);
    return r;
  },
  click: function () { if (this.onclick) this.onclick(); }
};
function loadPage(file) {
  var html = fs.readFileSync(dir + "/" + file, "utf8"), ids = {};
  var ctx = {
    document: {
      getElementById: function (id) {
        if (!ids[id]) {
          if (html.indexOf('id="' + id + '"') < 0) throw new Error(file + " has no element " + id);
          ids[id] = new Node("x");
        }
        return ids[id];
      },
      createElement: function (t) { return new Node(t); },
      createTextNode: function (t) { var n = new Node("#t"); n.textContent = t; return n; }
    },
    localStorage: localStorage, console: console, JSON: JSON, Number: Number, Math: Math, Object: Object,
    alerts: [],
    window: { prompt: function () { return "x"; }, confirm: function () { return true; }, addEventListener: function () {} }
  };
  ctx.window.alert = function (m) { ctx.alerts.push(m); };
  vm.createContext(ctx);
  (html.match(/<script src="([^"]+)"/g) || []).forEach(function (tag) {
    vm.runInContext(fs.readFileSync(dir + "/" + tag.match(/"([^"]+)"/)[1], "utf8"), ctx);
  });
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], ctx);
  return function (code) { return vm.runInContext(code, ctx); };
}

var pub = loadPage("public.html");
var off = loadPage("officer.html");
var failures = 0;
function check(name, ok, detail) {
  if (!ok) failures++;
  console.log((ok ? "PASS " : "FAIL ") + name + (detail ? "\n       " + detail : ""));
}

console.log("UNHAPPY-PATH TEST · all data is made up\n");

// ---- Forced failure ----
console.log("Forced failure: saving fails while ICA1001 is submitted");
pub('el("sample").value = "0"; fillFromSample();');
pub('el("force-fail").checked = true; FORCE_SAVE_FAILURE = true;');
pub("submitApplication()");
var box = pub('el("check-result").textContent');
check("Applicant is told it did not go through", /could not submit/.test(box), box.replace(/\s+/g, " ").slice(0, 160));
check("Form still holds what they typed", pub('el("app-id").value') === "ICA1001" &&
  pub('el("file-idCard").value') === "identity_card_front_and_back.pdf");
check("Nothing reached the officer", off("loadStore().queue.length") === 0);
check("No 'submitted' message was shown", !/Application submitted/.test(box));

console.log("\nSystem back up: applicant presses Try again");
pub("FORCE_SAVE_FAILURE = false;");
pub('el("check-result").querySelectorAll("button")[0].click()');
check("Application now submitted", /Application submitted/.test(pub('el("check-result").textContent')));
check("Officer queue has exactly 1 case", off("loadStore().queue.length") === 1);

console.log("\nForced failure on the officer page: saving fails when the officer decides");
off("FORCE_SAVE_FAILURE = true; render(); officerDecides(0, 'Approved');");
check("Officer is warned", off("alerts.length") === 1 && /not saved/.test(off("alerts[0]")), off("alerts[0]"));
check("Case is still in the queue", off("loadStore().queue.length") === 1);
check("No reply was sent", off("loadStore().outbox.length") === 0);
off("FORCE_SAVE_FAILURE = false; officerDecides(0, 'Approved');");
check("Decision saves once the system is back", off("loadStore().outbox.length") === 1 && off("loadStore().queue.length") === 0);

// ---- Duplicate submission ----
console.log("\nSame application submitted twice");
pub('el("sample").value = "0"; fillFromSample(); submitApplication();');
var dup = pub('el("check-result").textContent');
check("Second submit is stopped", /already been submitted/.test(dup), dup.replace(/\s+/g, " ").slice(0, 120));
check("No second case was created", off("loadStore().queue.length") === 0 && off("loadStore().outbox.length") === 1);

// ---- Impossible inputs ----
console.log("\nImpossible inputs");
var rules = require("./rules.js"), rc = require("./check.js");
function photo() {
  return { width: 350, height: 350, sizeMB: 2, takenMonthsAgo: 1, background: "light blue",
    face: "visible", ears: "yes", glasses: "none", headgear: "none" };
}
[-3, 150, 7.5].forEach(function (age) {
  var r = rc.checkApplication({ applicant: "adult", age: age, idCardProvided: true, photo: photo() }, rules);
  check("Age " + age + " is not approved", r.suggestion !== "Approved", r.required.join("; "));
});
var p0 = photo(); p0.sizeMB = 0;
var r0 = rc.checkApplication({ applicant: "adult", age: 30, idCardProvided: true, photo: p0 }, rules);
check("A 0 MB photo is not approved", r0.suggestion !== "Approved", r0.required.join("; "));

console.log(failures === 0 ? "\nAll unhappy-path checks passed." : "\n" + failures + " check(s) failed.");
process.exit(failures === 0 ? 0 : 1);
