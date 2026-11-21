import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="content-container py-8 sm:py-12" data-testid="cart-container">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-black/60 mb-6">
        <LocalizedClientLink href="/" className="hover:text-black transition-colors">
          Home
        </LocalizedClientLink>
        <span>&gt;</span>
        <span className="text-black font-medium">Cart</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-black font-integral mb-8 tracking-tight">
        YOUR CART
      </h1>

      {cart?.items?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 lg:gap-10 items-start">
          {/* Left Items Box */}
          <div className="border border-black/10 rounded-[20px] p-4 sm:p-6 bg-white shadow-xs">
            <ItemsTemplate cart={cart} />
          </div>

          {/* Right Order Summary Box */}
          <div className="sticky top-28">
            <div className="border border-black/10 rounded-[20px] p-6 sm:p-7 bg-white shadow-xs">
              <Summary cart={cart} customer={customer} />
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-black/10 rounded-[20px] p-12 bg-white text-center shadow-xs">
          <EmptyCartMessage />
        </div>
      )}
    </div>
  )
}

export default CartTemplate
