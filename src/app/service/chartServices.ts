import { Injectable } from '@angular/core';
import { GrowthOverYearDto, MemberDto } from '@proxy/dev/acadmy/homes';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  // ✅ خلي النوع عام لتجنب تعارض الأنواع
  private charts: { [key: string]: Chart<any, any, any> } = {};

  initGrowthChart(canvasId: string, data: GrowthOverYearDto) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // دمّر القديم لو موجود
    if (this.charts[canvasId]) this.charts[canvasId].destroy();

    const months = data?.students?.map((m) => m.month) ?? [];
    const studentData = data?.students?.map((m) => m.count) ?? [];
    const teacherData = data?.teachers?.map((m) => m.count) ?? [];

    this.charts[canvasId] = new Chart<any, any, any>(ctx, {
      type: 'line',
      data: {
        labels: months.length ? months : [
          'January','February','March','April','May','June','July',
          'August','September','October','November','December'
        ],
        datasets: [
          {
            label: 'Students',
            data: studentData,
            borderColor: '#63D8F2',
            backgroundColor: 'rgba(99,216,242,0.1)',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Teachers',
            data: teacherData,
            borderColor: '#7749A6',
            backgroundColor: 'rgba(119,73,166,0.1)',
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { usePointStyle: true, padding: 20 },
          },
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(191,195,217,0.1)' } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  initCategoryChart(canvasId: string, members: MemberDto[]) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.charts[canvasId]) this.charts[canvasId].destroy();

    const labels = members?.map((m) => m.memberName) ?? [];
    const counts = members?.map((m) => m.membersCount) ?? [];

    this.charts[canvasId] = new Chart<any, any, any>(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Web', 'Programming', 'Marketing'],
        datasets: [
          {
            data: counts.length ? counts : [95, 80, 65],
            backgroundColor: [
              '#4B93BF', '#7749A6', '#A2A0D9', '#63D8F2', '#371559'
            ],
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 },
            },
          },
        },
        cutout: '70%',
      },
    });
  }

  destroyAllCharts() {
    Object.values(this.charts).forEach((chart) => chart.destroy());
    this.charts = {};
  }
}
