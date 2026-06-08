import test from "node:test";
import assert from "node:assert/strict";

import { getAvatarInitials } from "../src/lib/ui/avatar";
import { getVisibleContacts, getVisibleSocials } from "../src/lib/site/contact-config";
import { COMPANY_NAME, COMPANY_PROFILE } from "../src/lib/site/company-profile";

test("avatar initials use the first letters of two name parts", () => {
  assert.equal(getAvatarInitials("Lors Admin"), "LA");
});

test("avatar initials fall back to the email when the name is missing", () => {
  assert.equal(getAvatarInitials(null, "admin@lors-oto.com"), "A");
});

test("placeholder contacts are hidden", () => {
  assert.deepEqual(
    getVisibleContacts({
      email: "info@lors-oto.com",
      phone: "+90 555 555 5556",
      whatsapp: "https://wa.me/905555555556",
    }),
    [{ label: "Email", value: "info@lors-oto.com", href: "mailto:info@lors-oto.com" }]
  );
});

test("only configured real social links are visible", () => {
  assert.deepEqual(
    getVisibleSocials([
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "Instagram", href: "https://instagram.com/lorsoto" },
      { label: "Telegram", href: "" },
    ]),
    [{ label: "Instagram", href: "https://instagram.com/lorsoto" }]
  );
});

test("company profile uses the exact brand and real branch contacts", () => {
  assert.equal(COMPANY_NAME, "LORS OTO PASPAS");
  assert.equal(COMPANY_PROFILE.warrantyYears, 1);
  assert.equal(COMPANY_PROFILE.branches.length, 2);
  assert.equal(COMPANY_PROFILE.branches[0].phone, "+90 552 888 95 95");
  assert.equal(COMPANY_PROFILE.branches[1].phone, "+90 555 864 95 95");
});
