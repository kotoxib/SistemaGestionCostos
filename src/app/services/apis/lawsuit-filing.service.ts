import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import {
  CreateLawsuitFilingRequest,
  CreateLawsuitFilingResponse,
  DeleteLawsuitFilingResponse,
  GetAllLawsuitFilingPaginationRequest,
  GetAllLawsuitFilingPaginationResponse,
  GetLawsuitFilingByIdResponse,
  UpdateLawsuitFilingRequest,
  UpdateLawsuitFilingResponse,
  UploadLawsuitDocumentRequest,
  UploadLawsuitDocumentResponse,
} from '@interfaces/lawsuitFiling';
import { IPaginateResponse } from '@core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LawsuitFilingService {
  private readonly apiService = inject(ApiService);
  private readonly controller = 'LawsuitFiling';

  getAllLawsuitFilingPagination(
    request: GetAllLawsuitFilingPaginationRequest,
  ): Observable<IPaginateResponse<GetAllLawsuitFilingPaginationResponse>> {
    const url = `${this.controller}/getAllLawsuitFilingPagination`;
    return this.apiService.get<IPaginateResponse<GetAllLawsuitFilingPaginationResponse>>(
      url,
      request,
    );
  }

  getLawsuitFilingById(lawsuitFilingId: number): Observable<GetLawsuitFilingByIdResponse> {
    const url = `${this.controller}/${lawsuitFilingId}/getLawsuitFilingById`;
    return this.apiService.get<GetLawsuitFilingByIdResponse>(url);
  }

  createLawsuitFiling(
    request: CreateLawsuitFilingRequest,
  ): Observable<CreateLawsuitFilingResponse> {
    const url = `${this.controller}/createLawsuitFiling`;
    return this.apiService.post<CreateLawsuitFilingResponse>(url, request);
  }

  updateLawsuitFiling(
    request: UpdateLawsuitFilingRequest,
  ): Observable<UpdateLawsuitFilingResponse> {
    const url = `${this.controller}/updateLawsuitFiling`;
    return this.apiService.put<UpdateLawsuitFilingResponse>(url, request);
  }

  deleteLawsuitFiling(lawsuitFilingId: number): Observable<DeleteLawsuitFilingResponse> {
    const url = `${this.controller}/${lawsuitFilingId}/deleteLawsuitFiling`;
    return this.apiService.delete<DeleteLawsuitFilingResponse>(url);
  }

  uploadLawsuitDocument(
    request: UploadLawsuitDocumentRequest,
  ): Observable<UploadLawsuitDocumentResponse> {
    const url = `${this.controller}/uploadLawsuitDocument`;
    return this.apiService.post<UploadLawsuitDocumentResponse>(url, request);
  }
}
