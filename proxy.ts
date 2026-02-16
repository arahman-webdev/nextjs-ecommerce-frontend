import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./types/user";

/* ---------------------------
   Role-based allowed routes
---------------------------- */
const roleBasedRoutes: Record<string, string[]> = {
  ADMIN: ["/dashboard/admin", "/admin"],
  SELLER: ["/dashboard/seller", "/seller"],
  CUSTOMER: [
    "/dashboard/customer",
    "/customer",
    "/checkout",
    "/payment",
  ],
};

/* ---------------------------
   Public routes
---------------------------- */
const authRoutes = ["/login", "/register", "/forgot-password"];

/* ---------------------------
   Payment public routes
---------------------------- */
// const paymentPublicRoutes = [
//   "/checkout/success",
//   "/checkout/cancel",
//   "/payment/success",
// ];

/* ---------------------------
   Redirect helper
---------------------------- */
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search
  );
  return NextResponse.redirect(loginUrl);
}

/* ---------------------------
   Middleware
---------------------------- */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* 1Skip static & API */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  /* 2️⃣ Read access token */
  const accessToken = request.cookies.get("accessToken")?.value;

  /* 3️⃣ Allow public payment routes */
  // if (paymentPublicRoutes.some((r) => pathname.startsWith(r))) {
  //   return NextResponse.next();
  // }

  /* 4️⃣ Not logged in → protected route */
  if (!accessToken && !authRoutes.includes(pathname)) {
    return redirectToLogin(request);
  }

  /* 5️⃣ Logged in → auth pages */
  if (accessToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  /* 6️⃣ Decode token */
  let user: IUser | null = null;
  if (accessToken) {
    try {
      user = jwtDecode<IUser>(accessToken);
    } catch {
      const res = redirectToLogin(request);
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  /* 7️⃣ Role-based access control */
  if (user) {
    const allowedRoutes = roleBasedRoutes[user.userRole] || [];

    const isAllowed =
      pathname === "/" ||
      pathname === "/dashboard" ||
      allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

/* ---------------------------
   Matcher
---------------------------- */
export const config = {
  matcher: [
    "/checkout/:path*",
    "/payment/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/customer/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
