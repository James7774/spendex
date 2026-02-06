"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately since landing page is removed
    router.replace("/dashboard");
  }, [router]);

  return null; // Don't render anything
}
