import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

/**
 * Login Page
 * User authentication. LoginForm reads ?next=, which needs a Suspense boundary.
 */

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
