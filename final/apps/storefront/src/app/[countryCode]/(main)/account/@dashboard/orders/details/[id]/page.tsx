import { retrieveOrder } from "@lib/data/orders"
import { retrieveCustomer } from "@lib/data/customer"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) {
    return {
      title: "Order Details | High Fashion",
      description: "View your order details.",
    }
  }

  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return {
      title: "Order Not Found | High Fashion",
      description: "Order could not be found.",
    }
  }

  return {
    title: `Order #${order.display_id} | High Fashion`,
    description: `View your order details.`,
  }
}

export default async function OrderDetailPage(props: Props) {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) {
    return null
  }

  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return <OrderDetailsTemplate order={order} />
}
