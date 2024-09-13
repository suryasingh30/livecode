import { clerkMiddleware } from "@clerk/nextjs/server";

// Define the createRouteMatcher function
const createRouteMatcher = (routes: string[]) => (req: any) => {
  return routes.some((route) => req.url?.startsWith(route));
};

const protectedRoute = createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/recording',
  '/personal-room',
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
