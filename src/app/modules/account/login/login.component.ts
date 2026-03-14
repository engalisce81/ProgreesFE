import { AuthService, ReplaceableComponentsService } from '@abp/ng.core';
import { NgClass, NgIf } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/service/loginService';

@Component({
  selector: 'app-login-custom',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  rememberMe = true;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private loginService: LoginService, 
    private authService: AuthService, 
    private router: Router, 
    private replaceableComponents: ReplaceableComponentsService
  ) { }

  ngOnInit(): void { }

  login(): void {
    if (!this.username || !this.password) return;

    this.isLoading = true;
    this.errorMessage = ''; // تصفير الخطأ عند كل محاولة جديدة

    const parameters = {
      username: this.username.trim(),
      password: this.password,
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
      if (token?.access_token) {
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('refresh_token', token.refresh_token);
        localStorage.setItem('expires_in', token.expires_in);
      }
      
      // نجاح الدخول - إعادة تحميل الصفحة للـ Layout الجديد
      window.location.reload();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    })
    .catch(err => {
      this.isLoading = false; // إيقاف لودر التحميل عند الخطأ
      console.error('❌ Login failed', err);
      // عرض رسالة الخطأ القادمة من السيرفر أو رسالة افتراضية بالإنجليزية
      this.errorMessage = err.error?.error_description || 'Invalid username or password. Please try again.';
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}