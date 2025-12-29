
import { AuthenticationSection } from "@/components/authentication-section";
import { AuthGuard } from "@/components/auth-guard";

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <AuthenticationSection isSignUp={false} />
    </AuthGuard>
  );
}
