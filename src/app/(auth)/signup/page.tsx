import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm shadow-[0_24px_80px_-72px_rgba(15,23,42,0.75)]">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Your organization is created automatically.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm mode="signup" />
      </CardContent>
    </Card>
  );
}
