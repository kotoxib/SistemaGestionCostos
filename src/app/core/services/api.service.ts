import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConst } from '@core/constants/app.const';
import { EnvironmentStateService } from '@core/environment/environment-state.service';
import type { JsonSuccessResult } from '@core/interfaces/json-success-result.interface';
import { Utilities } from '@shared/utils/utilities';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

type HttpQueryParams = Record<
  string,
  string | number | boolean | readonly (string | number | boolean)[]
>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly environmentState = inject(EnvironmentStateService);

  private resolveUrl(path: string): string {
    const base = this.environmentState.getAppEnvironment().scgApiUrl.replace(/\/+$/, '');
    const segment = path.replace(/^\/+/, '');
    return `${base}/${segment}`;
  }

  private toHttpParams(cleaned: unknown): HttpQueryParams | undefined {
    if (!cleaned || typeof cleaned !== 'object' || Array.isArray(cleaned)) {
      return undefined;
    }
    return cleaned as HttpQueryParams;
  }

  get<TResponse>(
    url: string,
    objectParams?: unknown,
    headers?: HttpHeaders,
  ): Observable<TResponse> {
    const cleaned =
      objectParams !== undefined && objectParams !== null
        ? Utilities.delete_null_undefined_properties(objectParams)
        : undefined;
    const params = this.toHttpParams(cleaned);

    return this.http
      .get<JsonSuccessResult<TResponse>>(this.resolveUrl(url), {
        ...(params ? { params } : {}),
        ...(headers ? { headers } : {}),
      })
      .pipe(
        filter((response): boolean => Utilities.isJsonSuccessResult(response as object)),
        map((response) => (response as JsonSuccessResult<TResponse>).data as TResponse),
      );
  }

  getBlob(url: string, objectParams?: unknown) {
    const cleaned =
      objectParams !== undefined && objectParams !== null
        ? Utilities.delete_null_undefined_properties(objectParams)
        : undefined;
    const params = this.toHttpParams(cleaned);

    return this.http
      .get(this.resolveUrl(url), {
        ...(params ? { params } : {}),
        responseType: 'blob',
      })
      .pipe(filter((p: Blob) => !p.type.includes(AppConst.MimeType.Json)));
  }

  post<TResponse>(
    url: string,
    body: unknown,
    queryParams?: object,
    isFormData?: boolean,
  ): Observable<TResponse> {
    const payload = isFormData ? Utilities.modelToFormData(body as Record<string, unknown>) : body;
    const cleaned =
      queryParams !== undefined && queryParams !== null
        ? Utilities.delete_null_undefined_properties(queryParams)
        : undefined;
    const params = this.toHttpParams(cleaned);

    return this.http
      .post<JsonSuccessResult<TResponse>>(this.resolveUrl(url), payload, {
        ...(params ? { params } : {}),
      })
      .pipe(
        filter((response): boolean => Utilities.isJsonSuccessResult(response as object)),
        map((response) => (response as JsonSuccessResult<TResponse>).data as TResponse),
      );
  }

  postBlob(url: string, data: unknown, queryParams?: object) {
    const cleaned =
      queryParams !== undefined && queryParams !== null
        ? Utilities.delete_null_undefined_properties(queryParams)
        : undefined;
    const params = this.toHttpParams(cleaned);

    return this.http.post(this.resolveUrl(url), data, {
      ...(params ? { params } : {}),
      responseType: 'blob' as const,
    });
  }

  postBlobZip(url: string, data: unknown) {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/zip');
    return this.http
      .post(this.resolveUrl(url), data, {
        headers,
        responseType: 'blob' as const,
      })
      .pipe(filter((p: Blob) => !p.type.includes(AppConst.MimeType.Json)));
  }

  put<TResponse>(url: string, body: unknown, isFormData?: boolean): Observable<TResponse> {
    const payload = isFormData ? Utilities.modelToFormData(body as Record<string, unknown>) : body;
    return this.http.put<JsonSuccessResult<TResponse>>(this.resolveUrl(url), payload).pipe(
      filter((response): boolean => Utilities.isJsonSuccessResult(response as object)),
      map((response) => (response as JsonSuccessResult<TResponse>).data as TResponse),
    );
  }

  delete<TResponse>(url: string): Observable<TResponse> {
    return this.http.delete<JsonSuccessResult<TResponse>>(this.resolveUrl(url)).pipe(
      filter((response): boolean => Utilities.isJsonSuccessResult(response as object)),
      map((response) => (response as JsonSuccessResult<TResponse>).data as TResponse),
    );
  }
}
