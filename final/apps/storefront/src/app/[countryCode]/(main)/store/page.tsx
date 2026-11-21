import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Catalog | High Fashion",
  description: "Explore the full collection of High Fashion garments and essentials.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export default async function StorePage(props: Props) {
  const { countryCode } = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
