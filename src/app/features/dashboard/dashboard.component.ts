import { Component, OnInit } from '@angular/core';

import { catchError, EMPTY, finalize, take, tap } from 'rxjs';

import { ApiHttpService } from '@shared/services/api-http.service';
import { DashboardAnalytics } from '@models/response/dashboard-analytics.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  dashboard: DashboardAnalytics;

  constructor(private apiHttpService: ApiHttpService) {}

  ngOnInit() {
    this.fetchDashboard();
  }

  fetchDashboard() {
    this.loading = true;
    this.apiHttpService
      .getDashboardAnalytics()
      .pipe(
        take(1),
        tap((res: DashboardAnalytics) => {
          this.dashboard = res;
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  getCategoryBarWidth(value: any): number {
    const total = this.dashboard?.TotalBooks || 1;
    return Math.round((parseInt(value) / total) * 100);
  }
}
