import { redirect } from "next/navigation";

/**
 * Root page redirects to the demo page.
 */
export default function Home() {
  redirect("/demo");
}
