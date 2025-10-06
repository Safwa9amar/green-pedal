export function capitalizeWords(str: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
