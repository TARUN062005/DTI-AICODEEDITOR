import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - CodeCollab",
  description: "Login to your CodeCollab account",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        {/* ✅ Updated Clerk SignIn component with fallbackRedirectUrl */}
        <SignIn fallbackRedirectUrl="/dashboard" />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
