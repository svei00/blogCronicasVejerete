import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']); // This ensuees that all the routes inside the dashboard will be protected

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get the user id from the auth object
  if(!userId && isProtectedRoute(req)) { // If the user is not logged in and the route is protected, redirect to the sign in page
    return (await auth()).redirectToSignIn();
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};