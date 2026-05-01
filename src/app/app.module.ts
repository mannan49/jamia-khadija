import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { AuthInterceptor } from '@shared/utils/auth.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app.component';
import { appInitializer } from './app.initializer';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from '@shared/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@NgModule({
  declarations: [AppComponent, AuthLayoutComponent, MainLayoutComponent],
  imports: [
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    FooterComponent,
    FontAwesomeModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideCharts(withDefaultRegisterables()),
    provideHotToastConfig({
      duration: 1500,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
