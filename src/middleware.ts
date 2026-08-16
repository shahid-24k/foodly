import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;

  const needsAuth = ["/checkout", "/account", "/orders", "/favorites"].some((p) => path.startsWith(p));
  const needsRestaurant = path.startsWith("/restaurant/dashboard");
  const needsAdmin = path.startsWith("/admin");

  if ((needsAuth || needsRestaurant || needsAdmin) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (needsRestaurant || needsAdmin) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
    if (needsAdmin && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (needsRestaurant && profile?.role !== "restaurant" && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/checkout/:path*", "/account/:path*", "/orders/:path*", "/favorites/:path*", "/restaurant/:path*", "/admin/:path*"],
};
