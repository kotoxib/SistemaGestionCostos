import { IPaginationRequest } from '@core/interfaces/pagination';
import { CaseIncomeState } from '../case-income.interface';

export interface GetAllCaseIncomePaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  registrationDate?: string | null;
  state?: CaseIncomeState | null;
}
