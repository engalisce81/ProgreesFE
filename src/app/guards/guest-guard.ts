import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@abp/ng.core';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    // التحقق هل يوجد توكن (مستخدم مسجل)
    const isAuthenticated = this.authService.getAccessToken();

    if (isAuthenticated) {
      // إذا كان مسجل، لا تسمح له باللوجين وانقله للرئيسية
      return this.router.parseUrl('/'); 
    }

    // إذا لم يكن مسجل، يسمح له بالدخول (true)
    return true;
  }
}