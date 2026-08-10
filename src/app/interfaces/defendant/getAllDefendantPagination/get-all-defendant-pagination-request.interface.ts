import { IPaginationRequest } from '@core/interfaces/pagination';

export interface GetAllDefendantPaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  clientId?: number | null;
  state?: number | null;
}
