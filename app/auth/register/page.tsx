import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register - CodeCollab",
  description: "Create a new CodeCollab account",
};

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>

        {/* ✅ Updated Clerk SignUp component with fallbackRedirectUrl */}
        <SignUp fallbackRedirectUrl="/dashboard" />

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
