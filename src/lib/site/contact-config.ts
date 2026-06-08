export type ContactConfig = {
  email?: string;
  phone?: string;
  whatsapp?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

const PLACEHOLDER_VALUES = new Set([
  "+90 555 555 5556",
  "https://wa.me/905555555556",
  "https://instagram.com/",
  "https://facebook.com/",
  "https://t.me/",
  "https://x.com/",
]);

export const SITE_CONTACTS: ContactConfig = {
  email: "info@lors-oto.com",
};

export const SITE_SOCIALS: SocialLink[] = [];

export function getVisibleContacts(config: ContactConfig) {
  const contacts: { label: string; value: string; href: string }[] = [];

  if (config.email && !PLACEHOLDER_VALUES.has(config.email)) {
    contacts.push({ label: "Email", value: config.email, href: `mailto:${config.email}` });
  }
  if (config.phone && !PLACEHOLDER_VALUES.has(config.phone)) {
    contacts.push({ label: "Phone", value: config.phone, href: `tel:${config.phone.replace(/\s/g, "")}` });
  }
  if (config.whatsapp && !PLACEHOLDER_VALUES.has(config.whatsapp)) {
    contacts.push({ label: "WhatsApp", value: "WhatsApp", href: config.whatsapp });
  }

  return contacts;
}

export function getVisibleSocials(links: SocialLink[]) {
  return links.filter((link) => Boolean(link.href) && !PLACEHOLDER_VALUES.has(link.href));
}
