import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  age?: number;
  role: 'admin' | 'guest' | 'superuser';
}

/**
 * [After 1] 通信責務の分離
 * データ取得の知識を Service に移動。
 */
@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private http = inject(HttpClient);
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://api.example.com/users').pipe(
      catchError(err => {
        console.error(err);
        return of([]); // エラー時は空配列を返すなどのフォールバック
      })
    );
  }
}
