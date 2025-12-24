import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * [Service] 共通 API クライアント
 * 
 * 各機能の Service (UserService, ProductService etc.) で
 * 毎回 `HttpClient` を直接叩き、同じようなエラーハンドリングや
 * ヘッダー付与を書くのは「重複」です。
 * 
 * 通信に関する知識（ベースURL、共通ヘッダー、エラースキーマ）を
 * このクラスに DRY 化します。
 */
@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private http = inject(HttpClient);
  
  // 環境変数などから取得すべき設定値（ここでは定数）
  private readonly PI_BASE_URL = 'https://api.example.com/v1';

  /**
   * 共通の GET リクエストラッパー
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    const options = {
      headers: this.getCommonHeaders(),
      params: new HttpParams({ fromObject: params || {} })
    };

    return this.http.get<T>(`${this.PI_BASE_URL}${endpoint}`, options).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 共通の POST リクエストラッパー
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.PI_BASE_URL}${endpoint}`, body, {
      headers: this.getCommonHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // 他にも put, delete など...

  /**
   * 共通ヘッダーの生成知識
   */
  private getCommonHeaders(): HttpHeaders {
    // 例: JWTトークンの付与など
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * 共通エラーハンドリング知識
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // クライアントサイドのエラー
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // サーバーサイドのエラー
      // ここで特定のステータスコード（401など）に対する共通処理も可能
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
