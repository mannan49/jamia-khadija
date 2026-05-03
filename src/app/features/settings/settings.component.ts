import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { SettingItemsConstants } from '@constants/setting-item.constants';


@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  settingItemsConstants = SettingItemsConstants

  constructor(private router: Router) {}

  onOptionClick(option) {
    this.router.navigateByUrl(option.route);
  }

}
