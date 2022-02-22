export const formatStrippedPhoneNumber = (stripped: string) => {
  if (stripped.length > 10) stripped = stripped.substring (0, 10);
  if (stripped.length === 0) return stripped;
  if (stripped.length < 4) return `(${stripped}`;
  if (stripped.length < 7) return `(${stripped.substring (0, 3)}) ${stripped.substring (3)}`;
  return `(${stripped.substring (0, 3)}) ${stripped.substring (3, 6)}-${stripped.substring (6)}`;
}

export const sanitizePhoneNumber = (number: string) => {
  let reduced = number.replaceAll (/[^0-9]/g, '');
  if (reduced.length !== 10) throw new Error ('Phone number must be 10 digits, current length: ' + reduced.length);
  return '+1' + reduced;
}

export const stripPhoneNumber = (number:string) => number.replaceAll (/[^0-9]/g, '');