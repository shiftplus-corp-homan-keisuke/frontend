// バリデーションスキーマのエクスポート
export * from './schemas';

// よく使用されるバリデーション関数のエクスポート
export {
  validateTaskDependencies,
  validateStudySessionDuration,
} from './schemas';

// バリデーションヘルパー関数
import { z } from 'zod';

/**
 * Zodスキーマを使用してデータを検証し、エラーメッセージを日本語で返す
 */
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['予期しないエラーが発生しました'] };
  }
};

/**
 * 部分的なデータ更新用のバリデーション
 */
export const validatePartialData = <T extends Record<string, any>>(
  schema: z.ZodObject<any>,
  data: unknown
): { success: true; data: Partial<T> } | { success: false; errors: string[] } => {
  try {
    const partialSchema = schema.partial();
    const validatedData = partialSchema.parse(data) as Partial<T>;
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => {
        const path = err.path.join('.');
        return path ? `${path}: ${err.message}` : err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['予期しないエラーが発生しました'] };
  }
};

/**
 * 配列データのバリデーション
 */
export const validateArrayData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown[]
): { success: true; data: T[] } | { success: false; errors: string[] } => {
  const results: T[] = [];
  const errors: string[] = [];

  data.forEach((item, index) => {
    const result = validateData(schema, item);
    if (result.success) {
      results.push(result.data);
    } else {
      errors.push(`インデックス ${index}: ${result.errors.join(', ')}`);
    }
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: results };
};

/**
 * フォームデータのバリデーション（FormDataオブジェクト用）
 */
export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; errors: string[] } => {
  const data: Record<string, any> = {};
  
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // 同じキーが複数ある場合は配列にする
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  return validateData(schema, data);
};

/**
 * 日付文字列を Date オブジェクトに変換するプリプロセッサ
 */
export const preprocessDates = (data: any): any => {
  if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(data)) {
    return new Date(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(preprocessDates);
  }
  
  if (data && typeof data === 'object') {
    const processed: any = {};
    for (const [key, value] of Object.entries(data)) {
      processed[key] = preprocessDates(value);
    }
    return processed;
  }
  
  return data;
};

/**
 * APIレスポンスの共通バリデーション
 */
export const validateApiResponse = <T>(
  dataSchema: z.ZodSchema<T>,
  response: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  const responseSchema = z.object({
    data: dataSchema,
    message: z.string().optional(),
    success: z.boolean(),
    timestamp: z.string().transform(str => new Date(str)),
  });

  const result = validateData(responseSchema, response);
  if (result.success) {
    return { success: true, data: result.data.data };
  }
  
  return result;
};

/**
 * ページネーション付きAPIレスポンスのバリデーション
 */
export const validatePaginatedResponse = <T>(
  dataSchema: z.ZodSchema<T>,
  response: unknown
): { success: true; data: T[]; meta: { total: number; page: number; limit: number; hasMore: boolean } } | { success: false; errors: string[] } => {
  const responseSchema = z.object({
    data: z.array(dataSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
    timestamp: z.string().transform(str => new Date(str)),
  });

  const result = validateData(responseSchema, response);
  if (result.success) {
    return {
      success: true,
      data: result.data.data,
      meta: {
        total: result.data.total,
        page: result.data.page,
        limit: result.data.limit,
        hasMore: result.data.hasMore,
      },
    };
  }
  
  return result;
};