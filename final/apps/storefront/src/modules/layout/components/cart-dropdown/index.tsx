"use client"

import { retrieveCart } from "@lib/data/cart"
import { CART_UPDATED_EVENT } from "@lib/util/cart-events"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { gsap, prefersReducedMotion } from "@lib/gsap"

const countItems = (cart?: HttpTypes.StoreCart | null) =>
  cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

const CartDropdown = ({
  cart: serverCart,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [clientCart, setClientCart] = useState<HttpTypes.StoreCart | null>(null)
  const cartState = serverCart ?? clientCart
  const [isOpen, setIsOpen] = useState(false)

  const drawerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)

  const open = () => setIsOpen(true)
  const close = () => {
    if (prefersReducedMotion() || !drawerRef.current) {
      setIsOpen(false)
      return
    }

    gsap.to(drawerRef.current, {
      xPercent: 100,
      duration: 0.32,
      ease: "power3.in",
    })
    gsap.to(backdropRef.current, {
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setIsOpen(false),
    })
  }

  const totalItems = countItems(cartState)
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  // Bounce / pop animation on the bag counter whenever items change
  useEffect(() => {
    if (badgeRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.45, color: "#FF3333" },
        { scale: 1, color: "inherit", duration: 0.45, ease: "back.out(2)" }
      )
    }
  }, [totalItems])

  // GSAP slide-in & items stagger when drawer opens
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      if (prefersReducedMotion()) {
        gsap.set(drawerRef.current, { xPercent: 0 })
        gsap.set(backdropRef.current, { autoAlpha: 1 })
      } else {
        gsap.fromTo(
          backdropRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.35, ease: "power2.out" }
        )
        gsap.fromTo(
          drawerRef.current,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.45, ease: "power3.out" }
        )
        gsap.from(".cart-drawer-item", {
          x: 24,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          delay: 0.15,
          ease: "power2.out",
        })
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (serverCart) {
      return
    }

    let isInitialLoad = true
    const load = () =>
      retrieveCart()
        .then((cart) => {
          if (isInitialLoad) {
            itemRef.current = countItems(cart)
            isInitialLoad = false
          }
          setClientCart(cart)
        })
        .catch(() => {})

    load()
    window.addEventListener(CART_UPDATED_EVENT, load)
    return () => window.removeEventListener(CART_UPDATED_EVENT, load)
  }, [serverCart])

  const pathname = usePathname()

  // Open cart drawer when a new item is added to cart, unless on checkout or cart page
  useEffect(() => {
    if (
      itemRef.current !== totalItems &&
      !pathname.includes("/cart") &&
      !pathname.includes("/checkout")
    ) {
      open()
      itemRef.current = totalItems
    }
  }, [totalItems, pathname])

  return (
    <div className="h-full z-50 flex items-center">
      <button
        onClick={open}
        data-cursor="hover"
        className="h-full flex items-center text-small-regular text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
        data-testid="nav-cart-link"
      >
        Bag (
        <span ref={badgeRef} className="inline-block will-change-transform">
          {totalItems}
        </span>
        )
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-[99]"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Cart Drawer */}
      {isOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-white z-[100] shadow-2xl flex flex-col border-l border-ui-border-base will-change-transform"
          data-testid="nav-cart-dropdown"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-ui-border-base flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-x-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ui-fg-subtle">
                High Fashion
              </span>
              <span className="text-ui-fg-muted">/</span>
              <h2 className="text-base font-medium tracking-tight text-ui-fg-base">
                Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={close}
              data-cursor="hover"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
              aria-label="Close bag"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="px-6 py-2.5 bg-neutral-900 text-white text-[11px] font-medium tracking-wider uppercase text-center">
            Complimentary Worldwide Express Delivery
          </div>

          {/* Line Items Container */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-ui-border-base">
            {cartState && cartState.items?.length ? (
              cartState.items
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item) => (
                  <div
                    className="cart-drawer-item py-4 first:pt-0 last:pb-0 flex gap-x-4 will-change-transform"
                    key={item.id}
                    data-testid="cart-item"
                  >
                    <LocalizedClientLink
                      href={`/products/${item.product_handle}`}
                      onClick={close}
                      data-cursor="view"
                      className="w-20 shrink-0 aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden"
                    >
                      <Thumbnail
                        thumbnail={item.thumbnail}
                        images={item.variant?.product?.images}
                        size="square"
                      />
                    </LocalizedClientLink>
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-x-2">
                          <h3 className="text-sm font-medium tracking-tight text-ui-fg-base truncate">
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              onClick={close}
                              data-testid="product-link"
                            >
                              {item.title}
                            </LocalizedClientLink>
                          </h3>
                          <LineItemPrice
                            item={item}
                            style="tight"
                            currencyCode={cartState.currency_code}
                          />
                        </div>
                        <div className="mt-1 text-xs text-ui-fg-subtle space-y-0.5">
                          <LineItemOptions
                            variant={item.variant}
                            data-testid="cart-item-variant"
                            data-value={item.variant}
                          />
                          <div
                            data-testid="cart-item-quantity"
                            data-value={item.quantity}
                          >
                            Quantity: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <DeleteButton
                          id={item.id}
                          className="text-xs text-ui-fg-muted hover:text-ui-fg-base transition-colors"
                          data-testid="cart-item-remove-button"
                        >
                          Remove
                        </DeleteButton>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center text-sm font-medium mb-4 text-ui-fg-subtle">
                  0
                </div>
                <p className="text-base font-medium tracking-tight text-ui-fg-base">
                  Your shopping bag is empty
                </p>
                <p className="text-xs text-ui-fg-subtle max-w-xs mt-1 mb-6 leading-relaxed">
                  Explore our seasonal capsule releases and tailored essentials to begin your wardrobe collection.
                </p>
                <LocalizedClientLink href="/store" onClick={close} data-cursor="hover">
                  <Button className="px-6 py-2.5 text-xs font-semibold tracking-widest uppercase">
                    Explore Collection
                  </Button>
                </LocalizedClientLink>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cartState && cartState.items?.length ? (
            <div className="p-6 border-t border-ui-border-base bg-neutral-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-ui-fg-subtle">
                  Subtotal (excl. taxes)
                </span>
                <span
                  className="text-lg font-medium text-ui-fg-base"
                  data-testid="cart-subtotal"
                  data-value={subtotal}
                >
                  {convertToLocale({
                    amount: subtotal,
                    currency_code: cartState.currency_code,
                  })}
                </span>
              </div>
              <p className="text-[11px] text-ui-fg-muted leading-relaxed">
                Shipping, duties, and taxes calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <LocalizedClientLink href="/cart" onClick={close} className="w-full" data-cursor="hover">
                  <Button
                    variant="secondary"
                    className="w-full py-3 text-xs uppercase tracking-wider font-semibold border-ui-border-base hover:bg-neutral-100 transition-colors"
                    data-testid="go-to-cart-button"
                  >
                    View Bag
                  </Button>
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/checkout?step=address"
                  onClick={close}
                  className="w-full"
                  data-cursor="hover"
                >
                  <Button
                    className="w-full py-3 text-xs uppercase tracking-wider font-semibold bg-neutral-900 text-white hover:bg-black transition-colors"
                    data-testid="checkout-button"
                  >
                    Checkout
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default CartDropdown
