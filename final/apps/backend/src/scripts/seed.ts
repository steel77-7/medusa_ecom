import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

interface MockProductDef {
  handle: string
  title: string
  subtitle?: string
  description: string
  price: number
  originalPrice?: number
  discountPercent?: number
  rating: number
  categoryHandle: string
  collectionHandles: string[]
  images: string[]
  colors?: string[]
  sizes?: string[]
}

const CATEGORIES_TO_ENSURE = [
  { name: "T-shirts", handle: "t-shirts" },
  { name: "Shorts", handle: "shorts" },
  { name: "Shirts", handle: "shirts" },
  { name: "Hoodie", handle: "hoodie" },
  { name: "Jeans", handle: "jeans" },
]

const COLLECTIONS_TO_ENSURE = [
  { title: "New Arrivals", handle: "new-arrivals" },
  { title: "Top Selling", handle: "top-selling" },
  { title: "Casual", handle: "casual" },
  { title: "Formal", handle: "formal" },
  { title: "Party", handle: "party" },
  { title: "Gym", handle: "gym" },
]

const DEFAULT_SIZES = ["Small", "Medium", "Large", "X-Large"]
const DEFAULT_COLORS = ["Olive", "Navy", "Black", "White"]

const MOCK_PRODUCTS: MockProductDef[] = [
  // --- Figma Desktop & Mobile Core Products ---
  {
    handle: "t-shirt-with-tape-details",
    title: "T-shirt with Tape Details",
    subtitle: "Premium cotton streetwear tee",
    description: "Crafted from heavyweight breathable cotton with distinctive industrial tape styling along the shoulders and sleeves. Relaxed boxy silhouette tailored for everyday high-fashion wear.",
    price: 120,
    rating: 4.5,
    categoryHandle: "t-shirts",
    collectionHandles: ["new-arrivals", "casual"],
    images: ["http://localhost:8000/figma/ef5f1.png"],
    colors: ["Black", "White", "Olive"],
  },
  {
    handle: "skinny-fit-jeans",
    title: "Skinny Fit Jeans",
    subtitle: "Tailored stretch indigo denim",
    description: "Engineered with comfort-stretch Turkish denim, these slim-tapered jeans feature subtle distressing and clean whiskering for a sharp, modern streetwear profile.",
    price: 240,
    originalPrice: 260,
    discountPercent: 20,
    rating: 4.5,
    categoryHandle: "jeans",
    collectionHandles: ["new-arrivals", "casual"],
    images: ["http://localhost:8000/figma/fbcfe.png"],
    colors: ["Navy", "Black"],
  },
  {
    handle: "checkered-shirt",
    title: "Checkered Shirt",
    subtitle: "Double-weave brushed cotton shirt",
    description: "A refined take on classic lumberjack checks. Features structured collar stays, double chest pockets, and horn-finish buttons suitable for layering or formal occasions.",
    price: 180,
    rating: 4.5,
    categoryHandle: "shirts",
    collectionHandles: ["new-arrivals", "casual", "formal"],
    images: ["http://localhost:8000/figma/fde46.png"],
    colors: ["Black", "White", "Navy"],
  },
  {
    handle: "sleeve-striped-t-shirt",
    title: "Sleeve Striped T-shirt",
    subtitle: "Contrast sleeve athletic cut",
    description: "High-contrast collegiate stripes on tailored sleeves. Crafted from soft organic pima cotton with reinforced neck ribbing for lasting structure.",
    price: 130,
    originalPrice: 160,
    discountPercent: 30,
    rating: 4.5,
    categoryHandle: "t-shirts",
    collectionHandles: ["new-arrivals", "casual"],
    images: ["http://localhost:8000/figma/15a8e.png"],
    colors: ["Olive", "Black", "White"],
  },
  {
    handle: "vertical-striped-shirt",
    title: "Vertical Striped Shirt",
    subtitle: "Resort-collar vertical stripe shirt",
    description: "Subtle slimming vertical stripes on breezy cotton poplin. Features a modern cuban collar, side-slit hem, and clean French placket.",
    price: 212,
    originalPrice: 232,
    discountPercent: 20,
    rating: 5.0,
    categoryHandle: "shirts",
    collectionHandles: ["top-selling", "casual", "formal"],
    images: ["http://localhost:8000/figma/ed49f.png"],
    colors: ["White", "Navy", "Olive"],
  },
  {
    handle: "courage-graphic-t-shirt",
    title: "Courage Graphic T-shirt",
    subtitle: "Heavyweight drop-shoulder graphic tee",
    description: "Bold typographic back print with subtle chest crest emblem. Garment-dyed for a sun-faded vintage finish that gets softer with every wash.",
    price: 145,
    rating: 4.0,
    categoryHandle: "t-shirts",
    collectionHandles: ["top-selling", "casual", "party"],
    images: ["http://localhost:8000/figma/86e5d.png"],
    colors: ["Black", "Olive", "White"],
  },
  {
    handle: "loose-fit-bermuda-shorts",
    title: "Loose Fit Bermuda Shorts",
    subtitle: "Comfort drawstring relaxed shorts",
    description: "Roomy Bermuda cut with elasticized waistband and tonal cotton drawstrings. Deep slant pockets and durable twill construction for leisure or gym.",
    price: 80,
    rating: 3.0,
    categoryHandle: "shorts",
    collectionHandles: ["top-selling", "casual", "gym"],
    images: ["http://localhost:8000/figma/77041.png"],
    colors: ["Navy", "Olive", "Black"],
  },
  {
    handle: "faded-skinny-jeans",
    title: "Faded Skinny Jeans",
    subtitle: "Stone-washed vintage denim",
    description: "Authentic stone-wash treatment creates a lived-in patina across knees and thighs. Fitted through the hip with a narrow ankle opening.",
    price: 210,
    rating: 4.5,
    categoryHandle: "jeans",
    collectionHandles: ["top-selling", "casual"],
    images: ["http://localhost:8000/figma/43fa5.png"],
    colors: ["Navy", "Black"],
  },
  {
    handle: "one-life-graphic-t-shirt",
    title: "One Life Graphic T-shirt",
    subtitle: "Iconic High Fashion signature tee",
    description: "The centerpiece of the High Fashion collection. Custom-milled 280 GSM cotton jersey with silkscreened graphic insignia, drop shoulders, and reinforced hems. Includes multi-angle photo showcase.",
    price: 260,
    originalPrice: 300,
    discountPercent: 40,
    rating: 4.5,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual", "party"],
    images: [
      "http://localhost:8000/figma/71e5c.png",
      "http://localhost:8000/figma/b1da5.png",
      "http://localhost:8000/figma/f1d18.png",
    ],
    colors: ["Olive", "Black", "Navy"],
  },
  {
    handle: "polo-with-contrast-trims",
    title: "Polo with Contrast Trims",
    subtitle: "Tipped collar piqué polo",
    description: "Mercerized cotton piqué featuring contrast twin-tipping along the collar and cuffs. Tailored slim fit with mother-of-pearl buttons.",
    price: 212,
    originalPrice: 242,
    discountPercent: 20,
    rating: 4.0,
    categoryHandle: "shirts",
    collectionHandles: ["casual", "formal"],
    images: ["http://localhost:8000/figma/79e4a.png"],
    colors: ["Navy", "White", "Olive"],
  },
  {
    handle: "gradient-graphic-t-shirt",
    title: "Gradient Graphic T-shirt",
    subtitle: "Degradé ombre sunset print",
    description: "Smooth tonal color gradient printed across premium combed cotton. Modern regular fit designed for weekend nightlife and party dressing.",
    price: 145,
    rating: 3.5,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual", "party"],
    images: ["http://localhost:8000/figma/822d2.png"],
    colors: ["White", "Black"],
  },
  {
    handle: "polo-with-tipping-details",
    title: "Polo with Tipping Details",
    subtitle: "Signature tipped knit polo",
    description: "Subtle micro-rib tipping accents the collar stand and arm cuffs. Soft breathable cotton construction with a clean minimalist silhouette.",
    price: 180,
    rating: 4.5,
    categoryHandle: "shirts",
    collectionHandles: ["casual", "formal"],
    images: ["http://localhost:8000/figma/a2356.png"],
    colors: ["Olive", "Black", "White"],
  },
  {
    handle: "black-striped-t-shirt",
    title: "Black Striped T-shirt",
    subtitle: "Breton-inspired horizontal stripe tee",
    description: "Classic monochrome Breton stripes woven from yarn-dyed dense jersey. Seamless rib collar and relaxed drape for effortless French streetwear appeal.",
    price: 120,
    originalPrice: 150,
    discountPercent: 30,
    rating: 5.0,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual"],
    images: ["http://localhost:8000/figma/c4418.png"],
    colors: ["Black", "White"],
  },

  // --- Extended High Fashion Hoodies ---
  {
    handle: "heavyweight-box-hoodie",
    title: "Heavyweight Box Cut Hoodie",
    subtitle: "500 GSM loopback cotton fleece",
    description: "Engineered with double-layered hood, ribbed side gussets, and seamless kangaroo pocket. Custom boxy cut with drop shoulders for cold-weather layering.",
    price: 190,
    originalPrice: 220,
    discountPercent: 15,
    rating: 4.8,
    categoryHandle: "hoodie",
    collectionHandles: ["casual", "gym"],
    images: ["http://localhost:8000/figma/15a8e.png"],
    colors: ["Black", "Olive", "Navy"],
  },
  {
    handle: "minimalist-oversized-hoodie",
    title: "Minimalist Oversized Hoodie",
    subtitle: "Clean no-drawstring fleece",
    description: "Stripped of drawstrings for a sleek architectural aesthetic. Brushed interior fleece with tonal High Fashion micro-embroidery at the cuff.",
    price: 175,
    rating: 4.6,
    categoryHandle: "hoodie",
    collectionHandles: ["casual"],
    images: ["http://localhost:8000/figma/ef5f1.png"],
    colors: ["Olive", "White", "Black"],
  },
  {
    handle: "french-terry-zip-hoodie",
    title: "French Terry Zip Hoodie",
    subtitle: "Two-way Excella zipped hoodie",
    description: "Features premium Japanese two-way metallic zip closure, ergonomic raglan sleeves, and hidden audio pocket. Built for seamless gym-to-street transitions.",
    price: 210,
    originalPrice: 250,
    discountPercent: 20,
    rating: 4.7,
    categoryHandle: "hoodie",
    collectionHandles: ["casual", "gym"],
    images: ["http://localhost:8000/figma/86e5d.png"],
    colors: ["Black", "Navy"],
  },
  {
    handle: "vintage-wash-pullover",
    title: "Vintage Wash Pullover Hoodie",
    subtitle: "Sun-faded pigment dyed pullover",
    description: "Subjected to proprietary wash cycle for authentic high-low contrast along seams and hems. Ultra-soft handle with cozy fleece warmth.",
    price: 185,
    rating: 4.4,
    categoryHandle: "hoodie",
    collectionHandles: ["casual"],
    images: ["http://localhost:8000/figma/ed49f.png"],
    colors: ["Olive", "Navy", "Black"],
  },

  // --- Extended High Fashion Shorts ---
  {
    handle: "relaxed-cargo-bermuda",
    title: "Relaxed Cargo Bermuda Shorts",
    subtitle: "Utility 6-pocket cotton cargo shorts",
    description: "Modernized military cargo shorts with pleated bellows pockets, magnetic flap closures, and adjustable waist cinch tabs.",
    price: 95,
    originalPrice: 115,
    discountPercent: 20,
    rating: 4.3,
    categoryHandle: "shorts",
    collectionHandles: ["casual", "gym"],
    images: ["http://localhost:8000/figma/77041.png"],
    colors: ["Olive", "Black"],
  },
  {
    handle: "tailored-linen-shorts",
    title: "Tailored Linen Shorts",
    subtitle: "Italian linen-cotton blend shorts",
    description: "Breezy blend of pure linen and combed cotton. Extended tab waistband with side adjusters and pressed creases for warm-weather formal dressing.",
    price: 110,
    rating: 4.7,
    categoryHandle: "shorts",
    collectionHandles: ["casual", "formal"],
    images: ["http://localhost:8000/figma/77041.png"],
    colors: ["White", "Navy", "Olive"],
  },
  {
    handle: "pleated-dress-shorts",
    title: "Pleated Dress Shorts",
    subtitle: "Double-pleated evening city shorts",
    description: "Double front pleats create refined volume through the leg. Finished with blind-stitched cuffs and satin-lined waistband.",
    price: 130,
    originalPrice: 160,
    discountPercent: 20,
    rating: 4.5,
    categoryHandle: "shorts",
    collectionHandles: ["formal", "party"],
    images: ["http://localhost:8000/figma/77041.png"],
    colors: ["Black", "Navy"],
  },
  {
    handle: "athletic-mesh-shorts",
    title: "Athletic Mesh Track Shorts",
    subtitle: "Breathable dual-layer performance shorts",
    description: "Moisture-wicking open mesh exterior with compression jersey inner lining. Contrast knit piping and reinforced zip key pocket.",
    price: 75,
    rating: 4.2,
    categoryHandle: "shorts",
    collectionHandles: ["gym"],
    images: ["http://localhost:8000/figma/77041.png"],
    colors: ["Black", "Navy", "Olive"],
  },

  // --- Extended High Fashion Jeans ---
  {
    handle: "raw-selvedge-denim-jeans",
    title: "Raw Selvedge Denim Jeans",
    subtitle: "14oz Japanese red-line selvedge",
    description: "Unwashed rigid denim woven on vintage shuttle looms. Clean red-line selvedge ID visible when cuffed. Will mold uniquely to the wearer's life.",
    price: 280,
    rating: 4.9,
    categoryHandle: "jeans",
    collectionHandles: ["casual", "formal"],
    images: ["http://localhost:8000/figma/fbcfe.png"],
    colors: ["Navy", "Black"],
  },
  {
    handle: "straight-leg-washed-jeans",
    title: "Straight Leg Washed Jeans",
    subtitle: "90s archival straight cut denim",
    description: "Classic mid-rise straight leg cut in 100% organic cotton. Light indigo tint with hand-buffed honeycombs and knee fades.",
    price: 195,
    originalPrice: 230,
    discountPercent: 15,
    rating: 4.6,
    categoryHandle: "jeans",
    collectionHandles: ["casual"],
    images: ["http://localhost:8000/figma/43fa5.png"],
    colors: ["Navy", "Black"],
  },
  {
    handle: "distressed-vintage-jeans",
    title: "Distressed Vintage Jeans",
    subtitle: "Ripped and repaired artisan denim",
    description: "Hand-distressed knee abrasions backed with indigo sashiko stitching. Custom copper rivets and raw edge ankle hems.",
    price: 220,
    rating: 4.5,
    categoryHandle: "jeans",
    collectionHandles: ["casual", "party"],
    images: ["http://localhost:8000/figma/fbcfe.png"],
    colors: ["Black", "Navy"],
  },
  {
    handle: "wide-leg-skater-jeans",
    title: "Wide Leg Baggy Skater Jeans",
    subtitle: "Generous skate silhouette denim",
    description: "Relaxed through seat and thigh with an easy drape pooling cleanly over sneakers. Deep front pockets and vintage nickel shank buttons.",
    price: 185,
    originalPrice: 210,
    discountPercent: 15,
    rating: 4.7,
    categoryHandle: "jeans",
    collectionHandles: ["casual"],
    images: ["http://localhost:8000/figma/43fa5.png"],
    colors: ["Black", "Navy"],
  },

  // --- Extended High Fashion Shirts ---
  {
    handle: "classic-oxford-shirt",
    title: "Classic Oxford Button Down Shirt",
    subtitle: "Heavyweight royal oxford cloth",
    description: "Timeless button-down collar with a natural roll. Durable basket-weave cotton with mother-of-pearl buttons, curved hem, and box pleat hanger loop.",
    price: 160,
    rating: 4.9,
    categoryHandle: "shirts",
    collectionHandles: ["formal"],
    images: ["http://localhost:8000/figma/fde46.png"],
    colors: ["White", "Navy"],
  },
  {
    handle: "camp-collar-silk-shirt",
    title: "Camp Collar Silk Blend Shirt",
    subtitle: "Lustrous evening lounge shirt",
    description: "Fluid mulberry silk and cotton blend that drapes with radiant movement. Open notched lapels and chest pocket designed for nightlife.",
    price: 225,
    originalPrice: 270,
    discountPercent: 20,
    rating: 4.8,
    categoryHandle: "shirts",
    collectionHandles: ["party"],
    images: ["http://localhost:8000/figma/ed49f.png"],
    colors: ["Black", "Olive"],
  },
  {
    handle: "striped-resort-shirt",
    title: "Striped Resort Cuban Shirt",
    subtitle: "Textured seersucker short-sleeve shirt",
    description: "Puckered seersucker weave that keeps fabric away from skin in warm climates. Bold cabana stripes with straight hem and camp collar.",
    price: 140,
    rating: 4.4,
    categoryHandle: "shirts",
    collectionHandles: ["casual", "party"],
    images: ["http://localhost:8000/figma/15a8e.png"],
    colors: ["Navy", "White", "Olive"],
  },

  // --- Extended High Fashion T-shirts ---
  {
    handle: "acid-wash-graphic-tee",
    title: "Acid Wash Heavyweight Graphic Tee",
    subtitle: "Mineral-washed graphic boxy tee",
    description: "Heavyweight 240 GSM carded cotton treated with mineral acid wash for marbled texture. Archival typography screenprint on chest.",
    price: 115,
    rating: 4.6,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual", "party"],
    images: ["http://localhost:8000/figma/822d2.png"],
    colors: ["Black", "Olive"],
  },
  {
    handle: "essential-oversized-blank-tee",
    title: "Essential Oversized Blank Tee",
    subtitle: "Pristine minimalist foundation tee",
    description: "No logos, zero distraction. Only flawless organic combed cotton cut with generous shoulders and a thick 1-inch collar band.",
    price: 85,
    rating: 4.9,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual", "gym"],
    images: ["http://localhost:8000/figma/ef5f1.png"],
    colors: ["White", "Black", "Olive", "Navy"],
  },
  {
    handle: "monochrome-pocket-tee",
    title: "Monochrome Heavyweight Pocket Tee",
    subtitle: "Chest pocket daily staple tee",
    description: "Features a single tailored chest pocket with subtle reinforced bartacks. Pre-shrunk high-density knit that holds its shape indefinitely.",
    price: 95,
    originalPrice: 110,
    discountPercent: 15,
    rating: 4.4,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual"],
    images: ["http://localhost:8000/figma/c4418.png"],
    colors: ["Black", "White", "Navy"],
  },
  {
    handle: "monogram-crewneck-tee",
    title: "Embroidered Monogram Crewneck Tee",
    subtitle: "Subtle HF crest embroidery tee",
    description: "Minimal High Fashion monogram stitched in high-density tonal thread at the left chest. Premium enzyme-washed jersey with velvety feel.",
    price: 135,
    rating: 4.7,
    categoryHandle: "t-shirts",
    collectionHandles: ["casual", "party"],
    images: ["http://localhost:8000/figma/86e5d.png"],
    colors: ["Olive", "Black", "White"],
  },
]

export default async function seedData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Starting High Fashion custom seed script...")

  // ---- 1. Resolve prerequisites -------------------------------------------
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  })
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })

  const salesChannel = salesChannels[0]
  const shippingProfile = shippingProfiles[0]
  const stockLocation = stockLocations[0]

  if (!salesChannel || !shippingProfile || !stockLocation) {
    throw new Error(
      "Missing prerequisite sales channel, shipping profile, or stock location. Run initial data migrations first."
    )
  }

  const currencyCodes: string[] = (stores[0]?.supported_currencies ?? [])
    .map((c) => c?.currency_code)
    .filter((code): code is string => Boolean(code))

  const supportedCurrencies = currencyCodes.length > 0 ? currencyCodes : ["usd", "eur"]

  logger.info(
    `Seeding into sales channel "${salesChannel.name}" with currencies [${supportedCurrencies.join(
      ", "
    )}] at location "${stockLocation.id}"`
  )

  // ---- 2. Ensure Categories Exist -----------------------------------------
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  const existingCategoryHandles = new Set(existingCategories.map((c) => c.handle))
  const missingCategories = CATEGORIES_TO_ENSURE.filter(
    (c) => !existingCategoryHandles.has(c.handle)
  )

  if (missingCategories.length > 0) {
    logger.info(`Creating ${missingCategories.length} missing product categories...`)
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
        })),
      },
    })
  }

  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })
  const categoryMap = new Map<string, string>()
  for (const cat of allCategories) {
    if (cat.handle) categoryMap.set(cat.handle, cat.id as string)
    if (cat.name) categoryMap.set(cat.name.toLowerCase(), cat.id as string)
  }

  // ---- 3. Ensure Collections Exist ----------------------------------------
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"],
  })

  const existingCollectionHandles = new Set(existingCollections.map((c) => c.handle))
  const missingCollections = COLLECTIONS_TO_ENSURE.filter(
    (c) => !existingCollectionHandles.has(c.handle)
  )

  if (missingCollections.length > 0) {
    logger.info(`Creating ${missingCollections.length} missing product collections...`)
    await createCollectionsWorkflow(container).run({
      input: {
        collections: missingCollections.map((c) => ({
          title: c.title,
          handle: c.handle,
        })),
      },
    })
  }

  const { data: allCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"],
  })
  const collectionMap = new Map<string, string>()
  for (const col of allCollections) {
    if (col.handle) collectionMap.set(col.handle, col.id as string)
  }

  // ---- 4. Clean up old/demo products so the catalog is 100% High Fashion ---
  const { data: allExistingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })

  const targetHandles = new Set(MOCK_PRODUCTS.map((p) => p.handle))
  const demoOrOldIdsToDelete: string[] = []

  for (const prod of allExistingProducts) {
    const handle = prod.handle || ""
    if (
      handle.startsWith("demo-") ||
      ["sweatshirt", "sweatpants", "shorts", "t-shirt"].includes(handle) ||
      targetHandles.has(handle)
    ) {
      demoOrOldIdsToDelete.push(prod.id as string)
    }
  }

  if (demoOrOldIdsToDelete.length > 0) {
    logger.info(`Removing ${demoOrOldIdsToDelete.length} obsolete / previous products for a fresh seed...`)
    try {
      await deleteProductsWorkflow(container).run({
        input: {
          ids: demoOrOldIdsToDelete,
        },
      })
      logger.info("Cleaned up existing products successfully.")
    } catch (err: any) {
      logger.warn(`Could not delete some products: ${err.message}`)
    }
  }

  // ---- 5. Prepare High Fashion Products -----------------------------------
  logger.info(`Constructing ${MOCK_PRODUCTS.length} High Fashion products...`)

  const productsPayload = MOCK_PRODUCTS.map((prod) => {
    const sizes = prod.sizes || DEFAULT_SIZES
    const colors = prod.colors || DEFAULT_COLORS
    const catId = categoryMap.get(prod.categoryHandle)
    const colId = prod.collectionHandles[0] ? collectionMap.get(prod.collectionHandles[0]) : undefined

    // Generate Cartesian variants
    const variants: Record<string, any>[] = []
    for (const size of sizes) {
      for (const color of colors) {
        const sku = `${prod.handle.toUpperCase()}-${size.substring(0, 2).toUpperCase()}-${color.substring(0, 3).toUpperCase()}`
        const prices = supportedCurrencies.map((currency_code) => {
          const rate = currency_code.toLowerCase() === "eur" ? 0.92 : 1.0
          const amount = Math.round(prod.price * rate)
          return {
            amount,
            currency_code: currency_code.toLowerCase(),
          }
        })

        variants.push({
          title: `${size} / ${color}`,
          sku,
          options: {
            Size: size,
            Color: color,
          },
          prices,
          manage_inventory: true,
          allow_backorder: true,
        })
      }
    }

    const metadata: Record<string, any> = {
      rating: prod.rating,
    }
    if (prod.originalPrice) {
      metadata.original_price = prod.originalPrice
    }
    if (prod.discountPercent) {
      metadata.discount_percent = prod.discountPercent
    }

    const storefrontBaseUrl = process.env.STOREFRONT_URL || process.env.NEXT_PUBLIC_BASE_URL || (process.env.STORE_CORS ? process.env.STORE_CORS.split(",")[0].trim() : "http://localhost:8000")
    const resolvedImages = prod.images.map((url) => url.replace("http://localhost:8000", storefrontBaseUrl))

    return {
      title: prod.title,
      handle: prod.handle,
      subtitle: prod.subtitle,
      description: prod.description,
      status: ProductStatus.PUBLISHED,
      is_giftcard: false,
      thumbnail: resolvedImages[0],
      images: resolvedImages.map((url) => ({ url })),
      shipping_profile_id: shippingProfile.id,
      sales_channels: [{ id: salesChannel.id }],
      collection_id: colId,
      category_ids: catId ? [catId] : [],
      metadata,
      options: [
        {
          title: "Size",
          values: sizes,
        },
        {
          title: "Color",
          values: colors,
        },
      ],
      variants,
    }
  })

  // ---- 6. Create Products in Batches --------------------------------------
  const BATCH_SIZE = 8
  let createdCount = 0

  for (let i = 0; i < productsPayload.length; i += BATCH_SIZE) {
    const batch = productsPayload.slice(i, i + BATCH_SIZE)
    await createProductsWorkflow(container).run({
      input: {
        products: batch as any,
      },
    })
    createdCount += batch.length
    logger.info(`Seeded ${createdCount}/${productsPayload.length} High Fashion products...`)
  }

  // ---- 7. Seed Inventory Levels -------------------------------------------
  logger.info("Configuring inventory levels for all variants...")
  const { data: allInventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "location_levels.location_id"],
  })

  const itemsNeedingLevels = allInventoryItems.filter(
    (item) => !item.location_levels?.some((lvl: any) => lvl.location_id === stockLocation.id)
  )

  if (itemsNeedingLevels.length > 0) {
    const inventoryLevels = itemsNeedingLevels.map((item) => ({
      location_id: stockLocation.id,
      stocked_quantity: 10000,
      inventory_item_id: item.id as string,
    }))

    // Ingest in batches of 100
    for (let i = 0; i < inventoryLevels.length; i += 100) {
      const chunk = inventoryLevels.slice(i, i + 100)
      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: chunk,
        },
      })
    }
    logger.info(`Assigned 10,000 units of inventory to ${itemsNeedingLevels.length} items.`)
  } else {
    logger.info("All inventory items already have inventory levels.")
  }

  // ---- 8. Catch up search ingestion ---------------------------------------
  try {
    const search = container.resolve(Modules.SEARCH)
    const { data: finalProducts } = await query.graph({
      entity: "product",
      fields: ["id"],
    })

    for (let i = 0; i < finalProducts.length; i += 25) {
      const chunk = finalProducts.slice(i, i + 25)
      await search.ingest({
        name: "product.created",
        data: chunk.map((p) => ({ id: p.id })),
      } as never)
    }
    logger.info(`Search index synchronized for ${finalProducts.length} product(s).`)
  } catch (err: any) {
    logger.warn(`Search sync note: ${err.message}`)
  }

  logger.info("High Fashion mock data seed completed successfully!")
}

