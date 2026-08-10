import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  CreateFeeRequestRequest,
  CreateFeeRequestResponse,
  DeleteFeeRequestResponse,
  GetAllFeeRequestPaginationRequest,
  GetAllFeeRequestPaginationResponse,
  GetFeeRequestByIdResponse,
  UpdateFeeRequestRequest,
  UpdateFeeRequestResponse,
  UpdateFeeRequestStateRequest,
  UpdateFeeRequestStateResponse,
} from '@interfaces/feeRequest';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeeRequestService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'FeeRequest';

  getAllFeeRequestPagination(
    request: GetAllFeeRequestPaginationRequest,
  ): Observable<IPaginateResponse<GetAllFeeRequestPaginationResponse>> {
    const url = `${this.controller}/getAllFeeRequestPagination`;
    return this.apiService.get<IPaginateResponse<GetAllFeeRequestPaginationResponse>>(
      url,
      request,
    );
  }

  getFeeRequestById(feeRequestId: number): Observable<GetFeeRequestByIdResponse> {
    const url = `${this.controller}/${feeRequestId}/getFeeRequestById`;
    return this.apiService.get<GetFeeRequestByIdResponse>(url);
  }

  createFeeRequest(request: CreateFeeRequestRequest): Observable<CreateFeeRequestResponse> {
    const url = `${this.controller}/createFeeRequest`;
    return this.apiService.post<CreateFeeRequestResponse>(url, request);
  }

  updateFeeRequest(request: UpdateFeeRequestRequest): Observable<UpdateFeeRequestResponse> {
    const url = `${this.controller}/updateFeeRequest`;
    return this.apiService.put<UpdateFeeRequestResponse>(url, request);
  }

  deleteFeeRequest(feeRequestId: number): Observable<DeleteFeeRequestResponse> {
    const url = `${this.controller}/${feeRequestId}/deleteFeeRequest`;
    return this.apiService.delete<DeleteFeeRequestResponse>(url);
  }

  updateFeeRequestState(
    request: UpdateFeeRequestStateRequest,
  ): Observable<UpdateFeeRequestStateResponse> {
    const url = `${this.controller}/updateFeeRequestState`;
    return this.apiService.put<UpdateFeeRequestStateResponse>(url, request);
  }
}
