
import { AuthenticationSection } from "@/components/authentication-section";
import { AuthGuard } from "@/components/auth-guard";

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false}>
      <AuthenticationSection isSignUp={true} />
    </AuthGuard>
  );
}
