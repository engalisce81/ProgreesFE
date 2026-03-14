import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistercustomDto, AccountcustomService } from '@proxy/dev/acadmy/account-customs';
import { LookupDto } from '@proxy/dev/acadmy/look-up';
import { UniversityService, CollegeService } from '@proxy/dev/acadmy/universites';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ,FormsModule ,NgClass ,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerDto: RegistercustomDto = {
    fullName: '',
    userName: '',
    password: '',
    gender: true,
    universityId: '',
    collegeId: '',
    accountTypeKey: 2,
    phoneNumber:''
  };

  universities: LookupDto[] = [];
  colleges: LookupDto[] = [];
  showPassword = false;
  loading = false; // 🔹 متغير التحميل
  errorMessage: string = '';

  constructor(
    private accountService: AccountcustomService,
    private universityService: UniversityService,
    private collegeService: CollegeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities() {
    this.universityService.getUniversitysList().subscribe({
      next: (res) => this.universities = res.items,
      error: (err) => console.error('Error loading universities', err)
    });
  }

  onUniversityChange(universityId: string) {
    this.registerDto.collegeId = '';
    this.colleges = [];
    if (universityId) {
      this.collegeService.getCollegesList(universityId).subscribe({
        next: (res) => this.colleges = res.items,
        error: (err) => console.error('Error loading colleges', err)
      });
    }
  }

  register() {
    this.loading = true; // 🔹 تفعيل الـ Loading
    this.errorMessage = '';

    this.accountService.register(this.registerDto).subscribe({
      next: (res) => {
        this.loading = false; // 🔹 إيقاف الـ Loading
        this.router.navigateByUrl('/accountc');
      },
      error: (err) => {
        this.loading = false; // 🔹 إيقاف الـ Loading
        console.error('❌ Register failed', err);
        this.errorMessage = err.error?.message || 'Register failed';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

