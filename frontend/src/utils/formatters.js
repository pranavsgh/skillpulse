// Todo Both: shared formatting helpers (dates, counts, etc.) used by dashboard + jobs pages

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}
