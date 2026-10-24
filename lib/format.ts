const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatMonth(value: string | null): string {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})/);
  if (!match) return value;
  const year = match[1];
  const month = Number(match[2]);
  return `${months[month - 1] ?? ""} ${year}`.trim();
}

export function formatRange(
  start: string,
  end: string | null,
  current: boolean
): string {
  const from = formatMonth(start);
  if (current) return `${from} — Present`;
  const to = formatMonth(end);
  return to ? `${from} — ${to}` : from;
}

export function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
