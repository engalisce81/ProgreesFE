import { Component, OnInit } from '@angular/core';
import { MediaItemService } from '@proxy/dev/acadmy/media-items';
import { UserInfoDto, ProfileUserService, UpdateProfielDto } from '@proxy/dev/acadmy/profile-users';
import { CommonModule } from '@angular/common';
import { LoginService } from 'src/app/service/loginService';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule], // تأكد من إضافة CommonModule
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent implements OnInit {
  profile!: UserInfoDto;
  loading = true;
  uploading = false;
  isDarkMode = true; // الحالة الافتراضية بناءً على الـ Root اللي بعتهولي قبل كدة

  constructor(
    private profileService: ProfileUserService,
    private mediaService: MediaItemService,
    private loginService: LoginService // حقن الـ LoginService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    // التحقق من الثيم المختار مسبقاً في الـ LocalStorage
    this.isDarkMode = localStorage.getItem('theme') !== 'light';
    this.applyTheme();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getTeacherProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --- منطق تغيير الثيم ---
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }

  // --- تسجيل الخروج ---
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.loginService.logout();
    }
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    this.uploading = true;

    this.mediaService.uploadImage(file).subscribe({
      next: (uploadResponse) => {
        const newUrl = uploadResponse.data;
        const updateModel: UpdateProfielDto = { logoUrl: newUrl };

        this.profileService.updateAllUserData(updateModel).subscribe({
          next: () => {
            this.profile.profilePictureUrl = newUrl;
            this.uploading = false;
          },
          error: () => this.uploading = false
        });
      },
      error: () => this.uploading = false
    });
  }
}