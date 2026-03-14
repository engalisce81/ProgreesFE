// src/app/services/login.service.ts
import { AuthService, ConfigStateService } from '@abp/ng.core';
import { AbpOAuthService } from '@abp/ng.oauth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

@Injectable({
    providedIn: 'root'
})
export class LoginService {

     private apiUrl = 'https://localhost:44318'; // 🔹 عدل URL حسب API بتاعك
      errorMessage = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private configState: ConfigStateService
  ) {}

  login(username: string, password: string, rememberMe = true): void {
    const parameters = {
      username,
      password,
      grant_type: 'password',
      client_id: 'Acadmy_App',
      scope: 'offline_access Acadmy'
    };

    this.authService.loginUsingGrant(
      'password',
      parameters,
      new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    )
    .then((token: any) => {
      // ✅ احفظ التوكن يدويًا في localStorage
      if (token?.access_token) {
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('refresh_token', token.refresh_token);
        localStorage.setItem('expires_in', token.expires_in);
      }
              window.location.reload();
      // ✅ روح للهوم واعمل refresh للـ layout
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);

      });
    })
    .catch(err => {
      console.error('❌ Login failed', err);
      this.errorMessage = err.error?.error_description || 'Login failed, please try again'
      
    });
  }


  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    //this.authService.logout();
    this.router.navigate(['/account']); // رجّع المستخدم لصفحة اللوجن
    window.location.reload();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
