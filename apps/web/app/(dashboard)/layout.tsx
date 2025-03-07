import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { SearchProvider } from '@/contexts/search-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { SidebarProvider } from '@workspace/ui/components/sidebar'
import { cn } from '@workspace/ui/lib/utils'
import Cookies from 'js-cookie'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <ThemeProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <div
            id="content"
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'transition-[width] duration-200 ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
            )}
          >
            {children}
          </div>
        </SidebarProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}
