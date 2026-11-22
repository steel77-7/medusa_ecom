import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import BrandTicker from "@modules/home/components/brand-ticker"
import FeaturedProducts from "@modules/home/components/featured-products"
import DressStyleGrid from "@modules/home/components/dress-style-grid"
import CustomerReviews from "@modules/home/components/customer-reviews"
import { listCollections } from "@lib/data/collections"
import { getRegion, listRegions } from "@lib/data/regions"
import { toJsonLd } from "@lib/util/product-structured-data"
import { getSiteOrigin, listCountryCodes, STORE_NAME } from "@lib/util/site"
import { buildRegionsReturnPolicies } from "@lib/util/store-policies"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])

  const title = "High Fashion | Find Clothes That Matches Your Style"
  const description =
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style."
  const previewImage =
    "https://res.cloudinary.com/dtmqwo4sq/image/upload/v1795339836/ss-20261122-145948_uhie2e.png"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${origin}/${countryCode}`,
      siteName: "High Fashion",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: "High Fashion Preview",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [previewImage],
    },
    alternates: {
      canonical: `${origin}/${countryCode}`,
      languages: {
        ...Object.fromEntries(
          listCountryCodes(regions).map((code) => [
            `en-${code.toUpperCase()}`,
            `${origin}/${code}`,
          ])
        ),
        "x-default": origin,
      },
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])
  const homeUrl = `${origin}/${countryCode}`
  const returnPolicies = buildRegionsReturnPolicies(regions)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: STORE_NAME,
      url: origin,
      ...(returnPolicies.length
        ? { hasMerchantReturnPolicy: returnPolicies }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: STORE_NAME,
      url: homeUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${homeUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]

  // Only display New Arrivals and Top Selling rails on homepage as per Figma design
  const featuredCollections = collections
    .filter((c) => c.handle === "new-arrivals" || c.handle === "top-selling")
    .sort((a, b) => (a.handle === "new-arrivals" ? -1 : 1))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      {/* Hero Section */}
      <Hero />

      {/* Luxury Partner Brand Strip */}
      <BrandTicker />

      {/* Product Highlights: New Arrivals & Top Selling */}
      <div className="w-full bg-white">
        <FeaturedProducts collections={featuredCollections} region={region} />
      </div>

      {/* Browse By Dress Style Bento Grid */}
      <DressStyleGrid />

      {/* Customer Reviews Section */}
      <CustomerReviews />
    </>
  )
}
