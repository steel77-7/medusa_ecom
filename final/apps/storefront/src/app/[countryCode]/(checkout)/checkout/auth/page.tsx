import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function CheckoutAuth(props: Props) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()

  if (customer) {
    redirect(`/${countryCode}/checkout`)
  }

  redirect(`/${countryCode}/account?redirect=/${countryCode}/checkout`)
}

