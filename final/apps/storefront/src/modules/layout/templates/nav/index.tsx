import { Suspense } from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import NavSearch from "@modules/layout/components/nav-search"
import NavLinks from "@modules/layout/components/nav-links"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-white">
      <AnnouncementBar />
      <header className="relative h-[68px] sm:h-[76px] border-b border-[rgba(0,0,0,0.1)] bg-white transition-colors duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full gap-4 md:gap-8">
          {/* Mobile hamburger menu */}
          <div className="flex items-center md:hidden">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>

          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <LocalizedClientLink
              href="/"
              className="text-2xl sm:text-[32px] font-black tracking-tight uppercase text-black font-integral hover:opacity-85 transition-opacity"
              data-testid="nav-store-link"
            >
              High Fashion
            </LocalizedClientLink>
          </div>

          {/* Navigation Links (Desktop) */}
          <NavLinks />

          {/* Search bar pill */}
          <div className="flex-1 max-w-[560px] hidden sm:block">
            <NavSearch />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <LocalizedClientLink
              href="/account"
              className="p-1 hover:text-neutral-600 transition-colors"
              data-testid="nav-account-link"
              aria-label="Account"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-neutral-600 flex items-center relative p-1"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
