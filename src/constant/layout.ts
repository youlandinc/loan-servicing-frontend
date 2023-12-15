import { LayoutSideMenuItem, ServiceType } from '@/types/layout';

export const LAYOUT_SIDE_MENU: { [key in ServiceType]: LayoutSideMenuItem[] } =
  {
    [ServiceType.SAAS]: [
      {
        label: 'Organization',
        url: '',
        key: 'Organization',
        children: [
          {
            label: 'General',
            url: '/settings/organization/general',
            key: 'General',
          },
          {
            label: 'Users',
            url: '/settings/organization/team_user',
            key: 'Users',
          },
          {
            label: 'Roles',
            url: '/settings/organization/roles',
            key: 'Roles',
          },
          {
            label: 'Notifications',
            url: '/notifications',
            key: 'Notifications',
          },
          {
            label: 'Plan & Billing',
            url: '/settings/billing',
            key: 'billing',
          },
        ],
      },
      {
        label: 'Account settings',
        url: '/settings/account_settings',
        key: 'Account settings',
      },
    ],
    [ServiceType.WHITE_LABEL]: [
      {
        label: 'Organization',
        url: '',
        key: 'Organization',
        children: [
          {
            label: 'General',
            url: '/settings/organization/general',
            key: 'General',
          },
          {
            label: 'Users',
            url: '/settings/organization/team_user',
            key: 'Users',
          },
        ],
      },
      {
        label: 'Account settings',
        url: '/settings/account_settings',
        key: 'Account settings',
      },
    ],
  };

export const LAYOUT_HEADER_PRODUCT = {};

export const LAYOUT_HEADER_TAB = [
  {
    label: 'Portfolio',
    key: 'Portfolio',
    url: '/portfolio',
  },
  {
    label: 'test',
    key: 'test',
    url: '/test',
  },
];

export const LAYOUT_HEADER_USER = {};
