// ** Type import
import { Access } from '~/core/constants'
import { VerticalNavItemsType } from '~/types/layout'

const navMain = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'material-symbols:dashboard-rounded',
      path: '/x',
      auth: false,
    },
    {
      sectionTitle: 'MASTER',
      access: [Access.DEVICE.READ, Access.LAYOUT.READ],
    },
    {
      title: 'Devices',
      icon: 'mdi:devices',
      access: [Access.DEVICE.READ, Access.TRACKER.READ],
      children: [
        {
          title: 'Available',
          path: '/x/device',
          icon: 'heroicons:device-phone-mobile-20-solid',
          access: [Access.DEVICE.READ],
        },
        {
          title: 'Unregistered',
          icon: 'ic:twotone-device-unknown',
          path: '/x/device-unlist',
          access: [Access.DEVICE.READ],
        },
      ],
    },
    {
      title: 'Product',
      icon: 'mdi:package-variant-closed',
      path: '/x/product',
      auth: false,
    },
    {
      title: 'Transaction',
      icon: 'mdi:swap-horizontal',
      path: '/x/transaction',
      auth: false,
    },
    {
      sectionTitle: 'SETTINGS',
      auth: false,
    },
    {
      title: 'User',
      icon: 'ph:user',
      path: '/x/user',
      auth: false,
    },
    {
      title: 'Role & Access',
      icon: 'icon-park-twotone:lock',
      path: '/x/role',
      auth: false,
    },
  ]
}

export default navMain
