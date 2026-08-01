export function createDataQuery(page = 1, pageSize = 24): string {
  return new URLSearchParams({
    Page: String(page),
    PageSize: String(pageSize),
    FilterBy: "",
    Filter: "",
  }).toString();
}
