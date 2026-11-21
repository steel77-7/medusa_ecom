"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { notifyCartUpdated } from "@lib/util/cart-events"
import { isVariantInStock } from "@lib/util/inventory"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { gsap, attachMagneticEffect, prefersReducedMotion } from "@lib/gsap"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

const getDefaultVariant = (product: HttpTypes.StoreProduct) =>
  product.variants?.find(isVariantInStock) ?? product.variants?.[0]

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [options, setOptions] = useState<Record<string, string | undefined>>(
    () => optionsAsKeymap(getDefaultVariant(product)?.options ?? null) ?? {}
  )
  const [quantity, setQuantity] = useState<number>(1)
  const [isUrlVariantApplied, setIsUrlVariantApplied] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const variantId = new URLSearchParams(window.location.search).get("v_id")
    const variant = product.variants?.find((v) => v.id === variantId)
    if (variant) {
      setOptions(optionsAsKeymap(variant.options) ?? {})
    }
    setIsUrlVariantApplied(true)
  }, [product.variants])

  useEffect(() => {
    if (!isUrlVariantApplied) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant, isUrlVariantApplied])

  const inStock = useMemo(
    () => isVariantInStock(selectedVariant),
    [selectedVariant]
  )

  const actionsRef = useRef<HTMLDivElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const quantityDisplayRef = useRef<HTMLSpanElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  useEffect(() => {
    const btn = submitButtonRef.current
    if (btn && !disabled && inStock && selectedVariant) {
      return attachMagneticEffect(btn, 0.25)
    }
  }, [disabled, inStock, selectedVariant])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })
    notifyCartUpdated()

    setIsAdding(false)
    if (submitButtonRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        submitButtonRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      )
    }
  }

  const handleQuantityChange = (newQ: number) => {
    setQuantity(newQ)
    if (quantityDisplayRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        quantityDisplayRef.current,
        { scale: 1.3 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" }
      )
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleAddToCart()
  }

  return (
    <>
      <div className="flex flex-col gap-y-4" ref={actionsRef}>
        <form
          method="post"
          action={`/${countryCode}/cart/add`}
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4"
        >
          <input type="hidden" name="product_id" value={product.id} />
          <input
            type="hidden"
            name="variant_id"
            value={isValidVariant ? selectedVariant?.id ?? "" : ""}
          />
          <input type="hidden" name="quantity" value={quantity} />

          {/* Pricing */}
          <ProductPrice product={product} variant={selectedVariant} />

          {/* Description */}
          {product.description && (
            <p className="text-sm sm:text-base text-black/60 leading-relaxed border-b border-black/10 pb-5">
              {product.description}
            </p>
          )}

          {/* Options / Selectors */}
          {(product.options || []).map((option) => (
            <OptionSelect
              key={option.id}
              option={option}
              current={options[option.id]}
              updateOption={setOptionValue}
              title={option.title ?? ""}
              name={`options[${option.id}]`}
              data-testid="product-options"
              disabled={!!disabled || isAdding}
            />
          ))}

          {/* Quantity Selector & Add to Cart button */}
          <div className="flex items-center gap-4 pt-4">
            {/* Quantity Pill */}
            <div className="bg-[#F0F0F0] rounded-full px-5 py-3.5 flex items-center justify-between gap-6 shrink-0">
              <button
                type="button"
                data-cursor="hover"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                className="text-lg font-bold text-black hover:opacity-60 transition-opacity p-0.5 active:scale-90"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span
                ref={quantityDisplayRef}
                className="text-base font-semibold text-black min-w-[16px] text-center inline-block will-change-transform"
              >
                {quantity}
              </span>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="text-lg font-bold text-black hover:opacity-60 transition-opacity p-0.5 active:scale-90"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              ref={submitButtonRef}
              type="submit"
              data-cursor="hover"
              disabled={
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                !isValidVariant
              }
              className={`flex-1 bg-black text-white rounded-full py-4 px-8 text-base font-medium hover:bg-neutral-800 transition-colors shadow-sm will-change-transform ${
                !inStock || !selectedVariant || !isValidVariant
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              data-testid="add-product-button"
            >
              {isAdding
                ? "Adding..."
                : !selectedVariant
                ? "Select variant"
                : !inStock || !isValidVariant
                ? "Out of stock"
                : "Add to Cart"}
            </button>
          </div>
        </form>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
