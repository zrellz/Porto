'use client'
// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from '~/core/layouts/Layout'

// ** Navigation Imports

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import AppBarContent from '~/core/components/app-bar/vertical/content'

// ** Hook Import
import { useSettings } from '~/hooks/use-settings'
import { VerticalNavItemsType } from '~/types/layout'

interface Props {
  children: ReactNode
  navItems: VerticalNavItemsType
}

const MenuLayout = ({ children, navItems }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  // ** Vars for server side navigation

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  settings.navHidden = false

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalLayoutProps={{
        navMenu: { navItems },
        appBar: {
          content: (props) => (
            <AppBarContent
              settings={settings}
              saveSettings={saveSettings}
              hidden={hidden}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
    >
      {children}
    </Layout>
  )
}

export default MenuLayout
