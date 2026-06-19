"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@phosphor-icons/react";

export default function AuthActionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");
    const apiKey = searchParams.get("apiKey");
    const continueUrl = searchParams.get("continueUrl");

    // Handle email sign-in
    if (mode === "signIn" && oobCode) {
      // Redirect to /content with the oobCode
      // The email will need to be entered on the content page or passed via continueUrl
      const params = new URLSearchParams();
      params.set("oobCode", oobCode);
      if (continueUrl) {
        params.set("continueUrl", continueUrl);
      }
      
      // Redirect to content page with the code
      router.replace(`/content?${params.toString()}`);
      return;
    }

    // If we don't have the required params, show error
    if (!oobCode) {
      setError("Invalid or expired sign-in link. Please request a new one.");
      return;
    }

    // For other modes or if mode is missing, redirect to content anyway
    router.replace("/content");
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 font-mono text-sm">{error}</p>
          <a
            href="/content"
            className="mt-4 inline-block text-white/50 hover:text-white/70 font-mono text-sm underline"
          >
            Go to sign-in page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} weight="bold" className="animate-spin text-white/50" />
        <p className="text-white/30 font-mono text-sm">Completing sign-in...</p>
      </div>
    </div>
  );
}
