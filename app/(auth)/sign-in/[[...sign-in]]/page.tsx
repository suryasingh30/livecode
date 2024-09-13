import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex h-screen w0full items-center justify-center">
        <SignIn/>
    </main>
  )
}
