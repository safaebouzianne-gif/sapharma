import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('sio_user');
      if (stored) return JSON.parse(stored);
    }
    return null;
  }

  login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('sio_user', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('sio_user');
    }
    this.currentUserSubject.next(null);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  isEmployee(): boolean {
    return this.currentUserValue?.role === 'EMPLOYE';
  }
}
