import { Component, OnInit } from '@angular/core';
import { ChartService } from '../service/chartServices';
import { LoginService } from '../service/loginService';
import { HomesDto, HomeService } from '@proxy/dev/acadmy/homes';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit  {
  homeData?: HomesDto;
  stats: any[] = [];
  loading = false; // حالة التحميل
  errorMessage = '';

  activities = [
    { icon: 'fas fa-user-plus', title: 'A new student joined the platform', time: '10 minutes ago' },
    { icon: 'fas fa-book', title: 'A new programming course was added', time: '2 hours ago' },
    { icon: 'fas fa-chart-line', title: 'Total revenue reached 50,000 SAR', time: '5 hours ago' },
    { icon: 'fas fa-graduation-cap', title: '100 students completed the Web Development course', time: '2 days ago' },
  ];

  constructor(
    private homeService: HomeService,
    private chartService: ChartService,
    private loginService:LoginService
  ) {}

  ngOnInit() {
    this.loadHomeData();
  }
ngOnDestroy() {
  this.chartService.destroyAllCharts();
}


  private loadHomeData() {
    this.loading = true;
    this.errorMessage = '';

    this.homeService.getHomeStatistics().subscribe({
      next: (res) => {
        this.homeData = res;
        this.loading = false;

        // ✅ إعداد الإحصائيات الثلاثة
        this.stats = [
          {
            title: res.nameFiledOne ?? 'Number of Students',
            value: res.countFiledOne.toLocaleString(),
            icon: 'fas fa-user-graduate',
            class: 'students',
            increase: `${res.percentageFiledOne}%`,
          },
          {
            title: res.nameFiledTwo ?? 'Number of Teachers',
            value: res.countFiledTwo.toLocaleString(),
            icon: 'fas fa-chalkboard-teacher',
            class: 'teachers',
            increase: `${res.percentageFiledTwo}%`,
          },
          {
            title: res.nameFiledThree ?? 'Number of Courses',
            value: res.countFiledThree.toLocaleString(),
            icon: 'fas fa-book',
            class: 'courses',
            increase: `${res.percentageFiledThree}%`,
          },
        ];

        // ✅ تأخير بسيط لضمان وجود عناصر <canvas> قبل الرسم
        setTimeout(() => {
          if (res.growthOverYear && res.members) {
            this.chartService.initGrowthChart('growthChart', res.growthOverYear);
            this.chartService.initCategoryChart('categoryChart', res.members);
          }
        }, 200);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Failed to load home statistics. Please try again later.';
      },
    });
  }
}
