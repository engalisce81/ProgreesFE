import { AuthService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    // 1. التحقق من وجود التوكن
    if (this.authService.getAccessToken()) {
      return true; // مسموح له بالدخول
    }

    // 2. التوجيه لصفحة الحساب (يجب عمل return هنا)
    return this.router.parseUrl('/account'); 
  }
}