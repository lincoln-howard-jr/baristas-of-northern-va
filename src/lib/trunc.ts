export default function trunc (str: string, chars:number=45) {
  if (str.length > chars - 3)
    return `${str.substring (0, chars - 3)}...`
  return str;
}