export const getBaseURL = () => {
  let url =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://localhost:8000"

  // Fallback if placeholder brackets like <your-project> were entered
  if (url.includes("<") || url.includes(">")) {
    url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://localhost:8000"
  }

  // Ensure protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`
  }

  try {
    return new URL(url).origin
  } catch {
    return "https://localhost:8000"
  }
}
