const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
export function printTime (d: Date) {
  return `${d.getHours () % 12 || 12}:${('00' + d.getMinutes ()).slice (-2)} ${d.getHours () > 11 ? 'pm' : 'am'}`;
}
export function printDate (d: Date) {
  return `${months [d.getMonth ()]} ${d.getDate ()}, ${d.getFullYear ()}`;
}
export function printDateTime (ts: number) {
  const d = new Date (ts * 1000);
  return `${printDate (d)} at ${printTime (d)}`;
}