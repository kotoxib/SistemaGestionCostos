import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  GetAllProcessCommissionPaginationRequest,
  GetAllProcessCommissionPaginationResponse,
  GetProcessCommissionByIdResponse,
  PayProcessCommissionRequest,
  PayProcessCommissionResponse,
  RegisterCommissionAdvanceRequest,
  RegisterCommissionAdvanceResponse,
  SettleProcessCommissionRequest,
  SettleProcessCommissionResponse,
} from '@interfaces/processCommission';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProcessCommissionService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'ProcessCommission';

  getAllProcessCommissionPagination(
    request: GetAllProcessCommissionPaginationRequest,
  ): Observable<IPaginateResponse<GetAllProcessCommissionPaginationResponse>> {
    const url = `${this.controller}/getAllProcessCommissionPagination`;
    return this.apiService.get<IPaginateResponse<GetAllProcessCommissionPaginationResponse>>(
      url,
      request,
    );
  }

  getProcessCommissionById(
    processCommissionId: string,
  ): Observable<GetProcessCommissionByIdResponse> {
    const url = `${this.controller}/${processCommissionId}/getProcessCommissionById`;
    return this.apiService.get<GetProcessCommissionByIdResponse>(url);
  }

  registerCommissionAdvance(
    request: RegisterCommissionAdvanceRequest,
  ): Observable<RegisterCommissionAdvanceResponse> {
    const url = `${this.controller}/registerCommissionAdvance`;
    return this.apiService.post<RegisterCommissionAdvanceResponse>(url, request);
  }

  payProcessCommission(
    request: PayProcessCommissionRequest,
  ): Observable<PayProcessCommissionResponse> {
    const url = `${this.controller}/payProcessCommission`;
    return this.apiService.post<PayProcessCommissionResponse>(url, request);
  }

  settleProcessCommission(
    request: SettleProcessCommissionRequest,
  ): Observable<SettleProcessCommissionResponse> {
    const url = `${this.controller}/settleProcessCommission`;
    return this.apiService.post<SettleProcessCommissionResponse>(url, request);
  }
}
