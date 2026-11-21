import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound, redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Account Dashboard | High Fashion",
  description: "Overview of your High Fashion member account activity.",
}

type Props = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function OverviewTemplate(props: Props) {
  const searchParams = await props.searchParams
  const redirectUrl = searchParams?.redirect
  if (redirectUrl) {
    redirect(redirectUrl)
  }

  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} />
}
