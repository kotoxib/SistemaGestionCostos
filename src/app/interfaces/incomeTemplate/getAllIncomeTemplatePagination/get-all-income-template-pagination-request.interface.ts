import { IPaginationRequest } from '@core/interfaces/pagination';

export interface GetAllIncomeTemplatePaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  clientId?: number | null;
}
