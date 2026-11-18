// Sample passport applications for the prototype.
// ALL DATA IS SYNTHETIC (made up). No real people, names, ID numbers, photos or files.
// Rules come from ../rulebook.md (made up) plus the group's own rules.
// Each sample fills every field of the test interface with its own made-up details.
// "expected" is the suggestion the rules give. It is used to test check.js.

function sampleFile(name, sizeMB) {
  return { name: name, sizeMB: sizeMB };
}

function samplePhoto(extra) {
  var p = { fileName: "passport_photo.jpg", width: 350, height: 350, sizeMB: 2, takenMonthsAgo: 1,
    background: "light blue", face: "visible", ears: "yes", glasses: "none", headgear: "none" };
  for (var k in extra) p[k] = extra[k];
  return p;
}

// Sets the "provided" flags the rules check, from the made-up files attached.
function sample(s) {
  var f = s.files || {};
  s.idCardProvided = !!f.idCard;
  s.birthRecordProvided = !!f.birthRecord;
  s.guardianIdProvided = !!f.guardianId;
  s.vaccinationProvided = !!f.vaccination;
  return s;
}

var SAMPLE_APPLICATIONS = [
  sample({
    id: "ICA1001", type: "renewal", applicant: "adult", name: "Alex Example", age: 34,
    files: { idCard: sampleFile("identity_card_front_and_back.pdf", 0.9) },
    photo: samplePhoto({}),
    expected: "Approved", note: "Adult renewal, everything complete"
  }),
  sample({
    id: "ICA1234", type: "renewal", applicant: "child", name: "Kai Example", age: 7,
    files: { birthRecord: sampleFile("birth_record.pdf", 0.6), guardianId: sampleFile("parent_identity_card.jpg", 1.2) },
    photo: samplePhoto({ fileName: "kai_photo.jpg", width: 320, height: 380, sizeMB: 1.5 }),
    expected: "More info needed", note: "Child renewal, no vaccination details"
  }),
  sample({
    id: "ICA1003", type: "new", applicant: "child", name: "Mira Sample", age: 2,
    files: { birthRecord: sampleFile("birth_record_scan.pdf", 0.7), guardianId: sampleFile("mother_identity_card.pdf", 0.8),
      vaccination: sampleFile("vaccination_record.pdf", 0.5) },
    photo: samplePhoto({ fileName: "baby_photo.png", width: 400, height: 400, sizeMB: 3, takenMonthsAgo: 2 }),
    expected: "Approved", note: "Child new application, everything complete"
  }),
  sample({
    id: "ICA1004", type: "new", applicant: "adult", name: "Jordan Testcase", age: 25,
    files: { idCard: sampleFile("ic_front_back.png", 2.1) },
    photo: samplePhoto({ fileName: "selfie_cropped.jpg", width: 250, height: 250, sizeMB: 1 }),
    expected: "More info needed", note: "Photo too small"
  }),
  sample({
    id: "ICA1005", type: "renewal", applicant: "adult", name: "Robin Sample", age: 41,
    files: { idCard: sampleFile("identity_card.pdf", 0.4) },
    photo: samplePhoto({ fileName: "old_photo.jpg", takenMonthsAgo: 7, background: "white" }),
    expected: "More info needed", note: "Old photo with a white background"
  }),
  sample({
    id: "ICA1006", type: "renewal", applicant: "adult", name: "Sam Placeholder", age: 58,
    files: { idCard: sampleFile("identity_card_scan.jpg", 1.6) },
    photo: samplePhoto({ fileName: "holiday_photo.jpg", width: 380, height: 360, sizeMB: 4, glasses: "tinted" }),
    expected: "More info needed", note: "Sunglasses in the photo"
  }),
  sample({
    id: "ICA1007", type: "renewal", applicant: "child", name: "Rin Example", age: 10,
    files: { guardianId: sampleFile("guardian_identity_card.pdf", 0.9) },
    photo: samplePhoto({ fileName: "big_photo.png", width: 500, height: 500, sizeMB: 4, ears: "no" }),
    expected: "More info needed", note: "Child renewal, four problems"
  }),
  sample({
    id: "ICA1008", type: "new", applicant: "adult", name: "Noor Testcase", age: 29,
    files: { idCard: sampleFile("identity_card.png", 1.1) },
    photo: samplePhoto({ fileName: "photo_with_headscarf.jpg", headgear: "unclear" }),
    expected: "Escalated to officer", note: "Not sure if the headgear is allowed"
  }),
  sample({
    id: "ICA1009", type: "new", applicant: "child", name: "Lee Sample", age: 5,
    files: { birthRecord: sampleFile("birth_record.jpg", 2.4), guardianId: sampleFile("father_identity_card.jpg", 1.9) },
    photo: samplePhoto({ fileName: "blurry_photo.jpg", width: 300, height: 300, face: "unclear", ears: "unclear" }),
    expected: "Escalated to officer", note: "No vaccination details and a blurry photo"
  }),
  sample({
    id: "ICA1010", type: "renewal", applicant: "child", name: "Ari Example", age: 6,
    files: { birthRecord: sampleFile("birth_record.pdf", 0.6), guardianId: sampleFile("parent_identity_card.pdf", 0.7),
      vaccination: sampleFile("dental_appointment_letter.pdf", 0.3) },
    photo: samplePhoto({ fileName: "ari_photo.jpg", width: 330, height: 360 }),
    expected: "Approved", note: "Dental letter in the vaccination slot (the rules cannot see this)"
  }),
  sample({
    id: "ICA1011", type: "renewal", applicant: "adult", name: "Casey Testcase", age: 45,
    files: { idCard: sampleFile("library_card.jpg", 0.5) },
    photo: samplePhoto({ fileName: "casey_photo.jpg", width: 360, height: 400, sizeMB: 2.5 }),
    expected: "Approved", note: "Library card instead of an identity card (the rules cannot see this)"
  }),
  sample({
    id: "ICA1012", type: "new", applicant: "adult", name: "Dana Example", age: 14,
    files: { idCard: sampleFile("identity_card.pdf", 0.8) },
    photo: samplePhoto({ fileName: "dana_photo.jpg", width: 300, height: 400, sizeMB: 19.9, takenMonthsAgo: 4,
      glasses: "clear" }),
    expected: "Approved", note: "Age 14 counts as an adult, photo on every limit"
  })
];

if (typeof module !== "undefined") module.exports = SAMPLE_APPLICATIONS;
