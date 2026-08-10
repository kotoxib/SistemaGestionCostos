import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  CreateDefendantRequest,
  CreateDefendantResponse,
  DeleteDefendantResponse,
  GetAllDefendantPaginationRequest,
  GetAllDefendantPaginationResponse,
  GetDefendantByIdResponse,
  UpdateDefendantRequest,
  UpdateDefendantResponse,
} from '@interfaces/defendant';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DefendantService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'Defendant';

  getAllDefendantPagination(
    request: GetAllDefendantPaginationRequest,
  ): Observable<IPaginateResponse<GetAllDefendantPaginationResponse>> {
    const url = `${this.controller}/getAllDefendantPagination`;
    return this.apiService.get<IPaginateResponse<GetAllDefendantPaginationResponse>>(
      url,
      request,
    );
  }

  getDefendantById(defendantId: number): Observable<GetDefendantByIdResponse> {
    const url = `${this.controller}/${defendantId}/getDefendantById`;
    return this.apiService.get<GetDefendantByIdResponse>(url);
  }

  createDefendant(request: CreateDefendantRequest): Observable<CreateDefendantResponse> {
    const url = `${this.controller}/createDefendant`;
    return this.apiService.post<CreateDefendantResponse>(url, request);
  }

  updateDefendant(request: UpdateDefendantRequest): Observable<UpdateDefendantResponse> {
    const url = `${this.controller}/updateDefendant`;
    return this.apiService.put<UpdateDefendantResponse>(url, request);
  }

  deleteDefendant(defendantId: number): Observable<DeleteDefendantResponse> {
    const url = `${this.controller}/${defendantId}/deleteDefendant`;
    return this.apiService.delete<DeleteDefendantResponse>(url);
  }
}
