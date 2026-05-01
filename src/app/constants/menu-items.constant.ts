import { MenuItem } from '@models/shared/menu-item.model';

export const MenuItemsConstants: MenuItem[] = [
  { label: 'طلبہ کا اندراج', icon: 'icon-user', route: '/students', exact: false },
  { label: 'سبق کا ریکارڈ', icon: 'icon-bookmark', route: '/lesson-record', exact: false },
  { label: 'لائبریری', icon: 'icon-books', route: '/library-books', exact: false },
  { label: 'اجرا ریکارڈ', icon: 'icon-edit', route: '/library-records', exact: false },
  { label: 'حاضری', icon: 'icon-verified-user', route: '/attendance', exact: false },
  { label: 'ترتیبات', icon: 'icon-settings', route: '/settings', exact: true },
  { label: 'لاگ آؤٹ', icon: 'icon-log-out', route: '/auth/login', exact: true },
];
