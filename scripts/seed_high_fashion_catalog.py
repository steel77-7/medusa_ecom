import urllib.request
import json

# 1. Login to admin
req = urllib.request.Request(
    "http://localhost:9000/auth/user/emailpass",
    data=json.dumps({"email": "utkarshkaundal1970@gmail.com", "password": "123456789"}).encode(),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    token = json.loads(resp.read().decode())["token"]

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

sales_channel_id = "sc_01M6RV78TFKKKY7MZ5F79ZGFAS"
shipping_profile_id = "sp_01M6RV78RKZ71ZADNMYJAMX4FQ"

# Create Collections if not existing: new-arrivals, top-selling
collections_to_create = [
    {"title": "New Arrivals", "handle": "new-arrivals"},
    {"title": "Top Selling", "handle": "top-selling"},
    {"title": "Casual", "handle": "casual"},
    {"title": "Formal", "handle": "formal"},
    {"title": "Party", "handle": "party"},
    {"title": "Gym", "handle": "gym"}
]

req = urllib.request.Request("http://localhost:9000/admin/collections", headers=headers)
with urllib.request.urlopen(req) as resp:
    existing_cols = {c["handle"]: c["id"] for c in json.loads(resp.read().decode())["collections"]}

for col in collections_to_create:
    if col["handle"] not in existing_cols:
        try:
            req = urllib.request.Request(
                "http://localhost:9000/admin/collections",
                data=json.dumps(col).encode(),
                headers=headers
            )
            with urllib.request.urlopen(req) as resp:
                created = json.loads(resp.read().decode())["collection"]
                existing_cols[created["handle"]] = created["id"]
                print(f"Created collection: {col['title']} -> {created['id']}")
        except Exception as e:
            print(f"Error creating collection {col['title']}: {e}")

# Check existing products
req = urllib.request.Request("http://localhost:9000/admin/products?limit=50", headers=headers)
with urllib.request.urlopen(req) as resp:
    existing_products = {p["handle"]: p["id"] for p in json.loads(resp.read().decode())["products"]}

products = [
    {
        "title": "T-shirt with Tape Details",
        "handle": "t-shirt-with-tape-details",
        "collection_handle": "new-arrivals",
        "description": "Crafted from heavy 100% organic cotton jersey with precision-stitched contrast tape detailing across the shoulders and sleeves. Relaxed contemporary streetwear fit.",
        "thumbnail": "http://localhost:8000/figma/ef5f1.png",
        "images": ["http://localhost:8000/figma/ef5f1.png"],
        "price": 120,
        "original_price": 120,
        "rating": 4.5,
        "rating_count": 128
    },
    {
        "title": "Skinny Fit Jeans",
        "handle": "skinny-fit-jeans",
        "collection_handle": "new-arrivals",
        "description": "Tailored premium stretch denim in deep indigo with reinforced rivet details and a tapered leg opening for a sleek, contemporary silhouette.",
        "thumbnail": "http://localhost:8000/figma/fbcfe.png",
        "images": ["http://localhost:8000/figma/fbcfe.png"],
        "price": 240,
        "original_price": 260,
        "discount_percent": 20,
        "rating": 3.5,
        "rating_count": 89
    },
    {
        "title": "Checkered Shirt",
        "handle": "checkered-shirt",
        "collection_handle": "new-arrivals",
        "description": "Brushed cotton flannel featuring an architectural checker pattern, point collar, mother-of-pearl buttons, and dual chest patch pockets.",
        "thumbnail": "http://localhost:8000/figma/fde46.png",
        "images": ["http://localhost:8000/figma/fde46.png"],
        "price": 180,
        "original_price": 180,
        "rating": 4.5,
        "rating_count": 156
    },
    {
        "title": "Sleeve Striped T-shirt",
        "handle": "sleeve-striped-t-shirt",
        "collection_handle": "new-arrivals",
        "description": "Bold contrast arm stripes on heavyweight combed cotton. Clean ribbed collar and drop-shoulder construction for an effortless streetwear drape.",
        "thumbnail": "http://localhost:8000/figma/15a8e.png",
        "images": ["http://localhost:8000/figma/15a8e.png"],
        "price": 130,
        "original_price": 160,
        "discount_percent": 30,
        "rating": 4.5,
        "rating_count": 210
    },
    {
        "title": "Vertical Striped Shirt",
        "handle": "vertical-striped-shirt",
        "collection_handle": "top-selling",
        "description": "Refined camp-collar woven shirt with elongated monochrome vertical stripes, breathable tencel-cotton blend, and relaxed hemline.",
        "thumbnail": "http://localhost:8000/figma/ed49f.png",
        "images": ["http://localhost:8000/figma/ed49f.png"],
        "price": 212,
        "original_price": 232,
        "discount_percent": 20,
        "rating": 5.0,
        "rating_count": 340
    },
    {
        "title": "Courage Graphic T-shirt",
        "handle": "courage-graphic-t-shirt",
        "collection_handle": "top-selling",
        "description": "Minimalist typographic statement print on raw organic cotton. High-density screenprint ink that softens with wash and wear.",
        "thumbnail": "http://localhost:8000/figma/86e5d.png",
        "images": ["http://localhost:8000/figma/86e5d.png"],
        "price": 145,
        "original_price": 145,
        "rating": 4.0,
        "rating_count": 195
    },
    {
        "title": "Loose Fit Bermuda Shorts",
        "handle": "loose-fit-bermuda-shorts",
        "collection_handle": "top-selling",
        "description": "Wide-leg Bermuda shorts crafted from structured twill with deep slash pockets, elasticized drawstring waistband, and raw edge finishing.",
        "thumbnail": "http://localhost:8000/figma/77041.png",
        "images": ["http://localhost:8000/figma/77041.png"],
        "price": 80,
        "original_price": 80,
        "rating": 3.0,
        "rating_count": 78
    },
    {
        "title": "Faded Skinny Jeans",
        "handle": "faded-skinny-jeans",
        "collection_handle": "top-selling",
        "description": "Artisanal vintage stone-washed denim with natural whisker wear patterns, distressed hems, and custom matte black hardware.",
        "thumbnail": "http://localhost:8000/figma/43fa5.png",
        "images": ["http://localhost:8000/figma/43fa5.png"],
        "price": 210,
        "original_price": 210,
        "rating": 4.5,
        "rating_count": 420
    },
    {
        "title": "One Life Graphic T-shirt",
        "handle": "one-life-graphic-t-shirt",
        "collection_handle": "top-selling",
        "description": "The iconic High Fashion One Life oversized tee. Features premium 260 GSM combed cotton, ribbed neckline, and high-impact front typography.",
        "thumbnail": "http://localhost:8000/figma/71e5c.png",
        "images": [
            "http://localhost:8000/figma/71e5c.png",
            "http://localhost:8000/figma/ef5f1.png",
            "http://localhost:8000/figma/86e5d.png"
        ],
        "price": 120,
        "original_price": 300,
        "discount_percent": 40,
        "rating": 4.5,
        "rating_count": 320
    }
]

sizes = ["Small", "Medium", "Large", "X-Large"]

for prod in products:
    handle = prod["handle"]
    if handle in existing_products:
        print(f"Product {prod['title']} already exists ({existing_products[handle]}). Updating thumbnail/collection...")
        payload = {
            "thumbnail": prod["thumbnail"],
            "images": [{"url": u} for u in prod["images"]],
            "collection_id": existing_cols.get(prod["collection_handle"]),
            "metadata": {
                "rating": prod.get("rating", 4.5),
                "rating_count": prod.get("rating_count", 100),
                "original_price": prod.get("original_price"),
                "discount_percent": prod.get("discount_percent")
            }
        }
        try:
            req = urllib.request.Request(
                f"http://localhost:9000/admin/products/{existing_products[handle]}",
                data=json.dumps(payload).encode(),
                headers=headers
            )
            with urllib.request.urlopen(req) as resp:
                print(f"Updated product {prod['title']}")
        except Exception as e:
            print(f"Error updating {prod['title']}: {e}")
        continue

    payload = {
        "title": prod["title"],
        "handle": prod["handle"],
        "description": prod["description"],
        "status": "published",
        "thumbnail": prod["thumbnail"],
        "images": [{"url": u} for u in prod["images"]],
        "collection_id": existing_cols.get(prod["collection_handle"]),
        "options": [
            {
                "title": "Size",
                "values": sizes
            }
        ],
        "variants": [
            {
                "title": size,
                "options": {"Size": size},
                "prices": [
                    {"amount": prod["price"], "currency_code": "usd"}
                ]
            }
            for size in sizes
        ],
        "sales_channels": [{"id": sales_channel_id}],
        "metadata": {
            "rating": prod.get("rating", 4.5),
            "rating_count": prod.get("rating_count", 100),
            "original_price": prod.get("original_price"),
            "discount_percent": prod.get("discount_percent")
        }
    }

    try:
        req = urllib.request.Request(
            "http://localhost:9000/admin/products",
            data=json.dumps(payload).encode(),
            headers=headers
        )
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"Successfully created product: {prod['title']} -> {data['product']['id']}")
    except Exception as e:
        print(f"Error creating product {prod['title']}: {e}")

