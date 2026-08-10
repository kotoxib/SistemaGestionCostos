import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  CreateCaseIncomeRequest,
  CreateCaseIncomeResponse,
  GetAllCaseIncomePaginationRequest,
  GetAllCaseIncomePaginationResponse,
  GetCaseIncomeByIdResponse,
  RegisterCaseIncomePaymentRequest,
  RegisterCaseIncomePaymentResponse,
} from '@interfaces/caseIncome';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CaseIncomeService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'CaseIncome';

  getAllCaseIncomePagination(
    request: GetAllCaseIncomePaginationRequest,
  ): Observable<IPaginateResponse<GetAllCaseIncomePaginationResponse>> {
    const url = `${this.controller}/getAllCaseIncomePagination`;
    return this.apiService.get<IPaginateResponse<GetAllCaseIncomePaginationResponse>>(
      url,
      request,
    );
  }

  getCaseIncomeById(caseIncomeId: number): Observable<GetCaseIncomeByIdResponse> {
    const url = `${this.controller}/${caseIncomeId}/getCaseIncomeById`;
    return this.apiService.get<GetCaseIncomeByIdResponse>(url);
  }

  createCaseIncome(request: CreateCaseIncomeRequest): Observable<CreateCaseIncomeResponse> {
    const url = `${this.controller}/createCaseIncome`;
    return this.apiService.post<CreateCaseIncomeResponse>(url, request);
  }

  registerCaseIncomePayment(
    request: RegisterCaseIncomePaymentRequest,
  ): Observable<RegisterCaseIncomePaymentResponse> {
    const url = `${this.controller}/registerCaseIncomePayment`;
    return this.apiService.post<RegisterCaseIncomePaymentResponse>(url, request);
  }
}
