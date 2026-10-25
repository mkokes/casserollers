// "Add to calendar" file for each rally: one all-day event for the weekend plus
// one event per schedule item, in Minneapolis time.
import type { APIContext } from 'astro';
import { getRallies, rallySlug, SITE_TITLE, type Rally } from '../../lib/site';

export async function getStaticPaths() {
  return (await getRallies()).map((rally) => ({ params: { slug: rallySlug(rally) }, props: { rally } }));
}

const TIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:America/Chicago',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0600',
  'TZOFFSETTO:-0500',
  'TZNAME:CDT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0600',
  'TZNAME:CST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

const text = (value: string) => value.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
const date = (iso: string) => iso.replaceAll('-', '');
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

function nextDay(iso: string) {
  const day = new Date(`${iso}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

// iCalendar lines are limited to 75 bytes; longer ones continue on a line
// starting with a space.
function fold(line: string) {
  const parts: string[] = [];
  let current = '';
  for (const char of line) {
    if (Buffer.byteLength(current + char) > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
    }
    current += char;
  }
  return [...parts, current].join('\r\n ');
}

function calendar(rally: Rally, site: URL) {
  const { title, path } = rally.data;
  const { start, end, stops, schedule } = rally.data.rally;
  const url = new URL(path, site).href;
  const slug = rallySlug(rally);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const address = (name?: string) => stops.find((stop) => stop.name === name);

  const events = [
    [
      `UID:${slug}@casserollers.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${date(start)}`,
      `DTEND;VALUE=DATE:${date(nextDay(end))}`,
      `SUMMARY:${text(title)}`,
      `DESCRIPTION:${text(`${SITE_TITLE} moped rally. Details: ${url}`)}`,
      `URL:${url}`,
    ],
    ...schedule.map((item, i) => {
      const stop = address(item.stop);
      // Default to an hour; an `until` earlier than `time` runs past midnight.
      const length = item.until ? (minutes(item.until) - minutes(item.time) + 1440) % 1440 || 60 : 60;
      return [
        `UID:${slug}-${i + 1}@casserollers.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART;TZID=America/Chicago:${date(item.date)}T${item.time.replace(':', '')}00`,
        `DURATION:PT${Math.floor(length / 60)}H${length % 60}M`,
        `SUMMARY:${text(`${title}: ${item.title}`)}`,
        ...(stop ? [`LOCATION:${text(`${stop.name}, ${stop.address}`)}`] : []),
        `URL:${url}`,
      ];
    }),
  ];

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Casserollers//Rallies//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${text(title)}`,
    ...TIMEZONE,
    ...events.flatMap((event) => ['BEGIN:VEVENT', ...event, 'END:VEVENT']),
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n');
}

export function GET({ props, site }: APIContext<{ rally: Rally }>) {
  return new Response(calendar(props.rally, site!) + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
}
