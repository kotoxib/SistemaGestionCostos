import { IPaginationRequest } from '@core/interfaces/pagination';
import { CaseCommissionState } from '../process-commission.interface';

export interface GetAllProcessCommissionPaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  responsibleAttorneyId?: number | null;
  state?: CaseCommissionState | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}
