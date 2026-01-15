import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./types/user";

// ---------------------------
// Role-based routes
const roleBasedRoutes: Record<string, string[]> = {
  ADMIN: ["/dashboard/admin", "/admin"],
  SELLER: ["/dashboard/seller", "/seller"],
  CUSTOMER: ["/dashboard/customer", "/customer"]
};

// Public routes
const authRoutes = ["/login", "/signup", "/forgot-password"];

// Utility: redirect to login with redirect param
function redirectToLogin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
}




// Middleware
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Skip static files & API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }






  // 2️⃣ Read tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log("from proxy accesstoken ", accessToken)

  // 3️⃣ Not logged in & trying to access protected route
  if (!accessToken && !refreshToken && !authRoutes.includes(pathname)) {
    return redirectToLogin(request);
  }

  // 4️⃣ Already logged in & accessing auth route
  if (accessToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5️⃣ Decode token
  let user: IUser | null = null;
  if (accessToken) {
    try {
      user = jwtDecode<IUser>(accessToken);
    } catch (err) {
      console.error("JWT decode error:", err);
      // Invalid token → clear cookie
      const res = redirectToLogin(request);
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  // 6️⃣ Role-based route check
  if (user) {
    const allowedRoutes = roleBasedRoutes[user.userRole] || [];
    const isAllowed = allowedRoutes.some((r) => pathname.startsWith(r));

    if (!isAllowed && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Middleware matcher
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/customer/:path*",
    "/login",
    "/signup",
    "/forgot-password"
  ],
};
