import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StoreFilterSidebar from "@modules/store/components/store-filter-sidebar"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export default function StoreTemplate({
  sortBy,
  page,
  countryCode,
  categoryHandle,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryHandle?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-8 sm:py-10" data-testid="category-container">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-black/60 mb-6 sm:mb-8">
        <LocalizedClientLink href="/" className="hover:text-black transition-colors">
          Home
        </LocalizedClientLink>
        <span>&gt;</span>
        <span className="text-black font-medium capitalize">
          {categoryHandle ? categoryHandle.replace("-", " ") : "Shop"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
        {/* Left Filters Sidebar */}
        <div className="w-full lg:w-[295px] shrink-0">
          <StoreFilterSidebar />
        </div>

        {/* Right Product Grid */}
        <div className="flex-1 w-full min-w-0">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-black capitalize font-integral">
              {categoryHandle ? categoryHandle.replace("-", " ") : "All Products"}
            </h1>

            <div className="flex items-center gap-4 text-sm text-black/60">
              <span>Showing products</span>
              <div className="flex items-center gap-2">
                <span className="text-black/60">Sort by:</span>
                <select
                  defaultValue={sort}
                  className="bg-transparent font-medium text-black focus:outline-none cursor-pointer"
                >
                  <option value="created_at">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
