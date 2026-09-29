// Arrival estimate in Israel time: base minutes per area, plus the rush-hour extra on Sunday to Thursday.
export type EtaData = {
  tz: string;
  rush: { extra: number; windows: [string, string][] };
  areas: { slug: string; name: string; minutes: number }[];
};

const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

export const nowInIsrael = (tz: string) => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), min: Number(get('hour')) * 60 + Number(get('minute')) };
};

export const isRush = (data: EtaData) => {
  const { day, min } = nowInIsrael(data.tz);
  if (day > 4) return false;
  return data.rush.windows.some(([a, b]) => min >= toMin(a) && min < toMin(b));
};

export const etaFor = (data: EtaData, slug: string) => {
  const a = data.areas.find((x) => x.slug === slug)!;
  return a.minutes + (isRush(data) ? data.rush.extra : 0);
};
