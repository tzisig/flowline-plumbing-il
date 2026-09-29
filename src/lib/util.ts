import { contact, areas, services, rush } from '../config/site.config';

/** WhatsApp link with a prefilled message. */
export const waLink = (text: string = contact.whatsappGreeting) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;

export const telLink = `tel:${contact.phoneHref}`;

/** 1234 -> "1,234 ₪" */
export const price = (n: number) => `${n.toLocaleString('he-IL')} ₪`;

/** Price range, or a single price when from === to. */
export const priceRange = (from: number, to: number) => (from === to ? price(from) : `${price(from)} עד ${price(to)}`);

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug)!;
export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)!;

/** Data the browser needs to estimate arrival times (see DispatchStatus and DispatchMap). */
export const etaData = () => ({
  tz: contact.timeZone,
  rush,
  areas: areas.map(({ slug, name, minutes }) => ({ slug, name, minutes })),
});

/** 2026-09-28 -> 28.9.2026 */
export const formatDate = (iso: string) => iso.split('-').reverse().map(Number).join('.');
