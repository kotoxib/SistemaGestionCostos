import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  CreateRefundRequest,
  CreateRefundResponse,
  DeleteRefundResponse,
  GetAllRefundPaginationRequest,
  GetAllRefundPaginationResponse,
  GetRefundByIdResponse,
  UpdateRefundRequest,
  UpdateRefundResponse,
} from '@interfaces/refund';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefundService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'Refund';

  getAllRefundPagination(
    request: GetAllRefundPaginationRequest,
  ): Observable<IPaginateResponse<GetAllRefundPaginationResponse>> {
    const url = `${this.controller}/getAllRefundPagination`;
    return this.apiService.get<IPaginateResponse<GetAllRefundPaginationResponse>>(url, request);
  }

  getRefundById(refundId: number): Observable<GetRefundByIdResponse> {
    const url = `${this.controller}/${refundId}/getRefundById`;
    return this.apiService.get<GetRefundByIdResponse>(url);
  }

  createRefund(request: CreateRefundRequest): Observable<CreateRefundResponse> {
    const url = `${this.controller}/createRefund`;
    return this.apiService.post<CreateRefundResponse>(url, request);
  }

  updateRefund(request: UpdateRefundRequest): Observable<UpdateRefundResponse> {
    const url = `${this.controller}/updateRefund`;
    return this.apiService.put<UpdateRefundResponse>(url, request);
  }

  deleteRefund(refundId: number): Observable<DeleteRefundResponse> {
    const url = `${this.controller}/${refundId}/deleteRefund`;
    return this.apiService.delete<DeleteRefundResponse>(url);
  }

  downloadRefund(refundId: number) {
    const url = `${this.controller}/${refundId}/downloadRefund`;
    return this.apiService.getBlob(url);
  }
}
