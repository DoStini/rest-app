export function formatTime(date?: Date): string {
  const currentDate = date || new Date();
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDateWithTime(date?: Date): string {
  const currentDate = date || new Date();
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear());
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
