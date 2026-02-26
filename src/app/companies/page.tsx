import { Suspense } from "react";
import CompaniesClient from "./CompaniesClient";

// Suspense boundary is required by Next.js when useSearchParams
// is used inside a client component in the App Router.
export default function CompaniesPage() {
  return (
    <Suspense>
      <CompaniesClient />
    </Suspense>
  );
}
