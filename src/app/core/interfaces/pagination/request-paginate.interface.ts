export class IRequestPaginate {
  first = 0;
  rows = 10;
  sortOrder = 1;
  sortField = 'id';
  filters = {};
  globalFilter: unknown;
  groupBy?: string;
  sortOrderGroupBy?: string;
}
