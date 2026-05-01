import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


import { MatIconModule } from '@angular/material/icon';

import { UserModel } from '@models/response/user-model.model';

import { MenuItemsConstants } from 'src/app/constants/menu-items.constant';

import { UserService } from '@shared/services/user.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, MatIconModule],
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMenuOpen = false;
  menuItems = MenuItemsConstants;
  user: UserModel;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.user = this.userService.getUserDetails();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
