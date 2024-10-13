import Layout from "@/components/SignIn_SignUp";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <Layout>
      <SignIn />
    </Layout>
  );
}
