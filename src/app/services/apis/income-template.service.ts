import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  CreateIncomeTemplateRequest,
  CreateIncomeTemplateResponse,
  DeleteIncomeTemplateResponse,
  GetAllIncomeTemplatePaginationRequest,
  GetAllIncomeTemplatePaginationResponse,
  GetIncomeTemplateByIdResponse,
  UpdateIncomeTemplateRequest,
  UpdateIncomeTemplateResponse,
} from '@interfaces/incomeTemplate';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IncomeTemplateService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'IncomeTemplate';

  getAllIncomeTemplatePagination(
    request: GetAllIncomeTemplatePaginationRequest,
  ): Observable<IPaginateResponse<GetAllIncomeTemplatePaginationResponse>> {
    const url = `${this.controller}/getAllIncomeTemplatePagination`;
    return this.apiService.get<IPaginateResponse<GetAllIncomeTemplatePaginationResponse>>(
      url,
      request,
    );
  }

  getIncomeTemplateById(incomeTemplateId: number): Observable<GetIncomeTemplateByIdResponse> {
    const url = `${this.controller}/${incomeTemplateId}/getIncomeTemplateById`;
    return this.apiService.get<GetIncomeTemplateByIdResponse>(url);
  }

  createIncomeTemplate(
    request: CreateIncomeTemplateRequest,
  ): Observable<CreateIncomeTemplateResponse> {
    const url = `${this.controller}/createIncomeTemplate`;
    return this.apiService.post<CreateIncomeTemplateResponse>(url, request);
  }

  updateIncomeTemplate(
    request: UpdateIncomeTemplateRequest,
  ): Observable<UpdateIncomeTemplateResponse> {
    const url = `${this.controller}/updateIncomeTemplate`;
    return this.apiService.put<UpdateIncomeTemplateResponse>(url, request);
  }

  deleteIncomeTemplate(incomeTemplateId: number): Observable<DeleteIncomeTemplateResponse> {
    const url = `${this.controller}/${incomeTemplateId}/deleteIncomeTemplate`;
    return this.apiService.delete<DeleteIncomeTemplateResponse>(url);
  }

  downloadIncomeTemplate(incomeTemplateId: number) {
    const url = `${this.controller}/${incomeTemplateId}/downloadIncomeTemplate`;
    return this.apiService.getBlob(url);
  }
}
