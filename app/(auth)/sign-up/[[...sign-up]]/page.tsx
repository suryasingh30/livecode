import Layout from "@/components/SignIn_SignUp";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <Layout>
      <SignUp />
    </Layout>
  );
}
