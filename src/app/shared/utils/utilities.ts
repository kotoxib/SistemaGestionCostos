import type { JsonSuccessResult } from '@core/interfaces/json-success-result.interface';

export class Utilities {
  static delete_null_undefined_properties(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj
        .map((v) =>
          v && typeof v === 'object' ? Utilities.delete_null_undefined_properties(v) : v,
        )
        .filter((v) => !(v == null));
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj as Record<string, unknown>)
        .map(([k, v]) => [
          k,
          v &&
            (v instanceof Date
              ? v.toISOString()
              : typeof v === 'object'
                ? Utilities.delete_null_undefined_properties(v)
                : v),
        ])
        .reduce<Record<string, unknown>>((a, tuple) => {
          const k = tuple[0] as string;
          const v = tuple[1];
          return v == null ? a : ((a[k] = v as unknown), a);
        }, {});
    }
    return obj;
  }

  static isJsonSuccessResult(obj: object): obj is JsonSuccessResult<unknown> {
    return 'data' in obj && 'message' in obj;
  }

  static modelToFormData(model: Record<string, unknown>): FormData {
    return Object.entries(model).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v, k) => {
          if (v && typeof v === 'object' && !(v instanceof File) && !(v instanceof Date)) {
            Object.entries(v as Record<string, unknown>).forEach(([subk, subv]) => {
              if (subv === undefined || subv === null) return;
              acc.append(
                `${key}[${k}].${subk}`,
                subv instanceof File || subv instanceof Blob ? subv : String(subv),
              );
            });
          } else if (v !== undefined && v !== null) {
            acc.append(`${key}[${k}]`, v as string | Blob);
          }
        });
      } else if (value !== undefined && value !== null) {
        acc.append(key, value instanceof File || value instanceof Blob ? value : String(value));
      }
      return acc;
    }, new FormData());
  }

  static downloadTextFile(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;'): void {
    const blob = new Blob(['﻿' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
