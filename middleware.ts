import {
  apiAuthPrefix,
  publicRoutes,
  restrictedRoutes
} from "@/routes";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import NextAuth, { Session } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "./i18n-config";
import { env } from "process";
import authConfig from "./auth.config";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  return matchLocale(languages, locales, i18n.defaultLocale);
}

const { auth: middleware } = NextAuth(authConfig);

export default middleware((request: NextRequest & { auth: Session | null }): Response | void => {
  const pathname = request.nextUrl.pathname;

  // ✅ 关键点：Sanity Studio 后台访问 /studio 时不做任何处理，直接跳过
  if (pathname.startsWith("/studio")) {
    console.log("middleware: skip /studio");
    return NextResponse.next();
  }

  // ✅ 跳过静态文件
  if (
    [
      '/og.png',
      '/logo.png',
      '/favicon.ico',
      '/favicon-16x16.png',
      '/favicon-32x32.png',
      '/apple-touch-icon.png',
      '/android-chrome-192x192.png',
      '/android-chrome-512x512.png',
      '/site.webmanifest',
      '/google04f08bcda3b90dec.html',
      '/robots.txt',
      '/sitemap.xml',
    ].includes(pathname)
  ) {
    return;
  }

  if (pathname.startsWith('/images/')) {
    return;
  }

  // ✅ 若路径中不包含 locale（如 /zh、/en），则自动重定向
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const locale = getLocale(request);

  if (pathnameIsMissingLocale) {
    let redirectUrl = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    if (request.nextUrl.search) {
      redirectUrl += request.nextUrl.search;
    }

    if (
      redirectUrl.startsWith("/zh") ||
      redirectUrl.startsWith("/en") ||
      redirectUrl.startsWith("/fr") // 如你支持其他语言可添加
    ) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;

  let nextUrlPathname = nextUrl.pathname;
  i18n.locales.map((locale) => {
    nextUrlPathname = nextUrlPathname.replace(new RegExp(`^/${locale}`), "");
  });

  const nextUrlPathNameWithoutLocale = nextUrlPathname === "" ? "/" : nextUrlPathname;

  const isRestrictedRoute = restrictedRoutes.some((route) =>
    nextUrlPathNameWithoutLocale.startsWith(route)
  );

  if (isRestrictedRoute) {
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
  }

  const isApiAuthRoute = nextUrlPathNameWithoutLocale.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    return;
  }

  const isPublicRoute = publicRoutes.some((route) => {
    return route === "/"
      ? nextUrlPathNameWithoutLocale === route
      : nextUrlPathNameWithoutLocale.startsWith(route);
  });

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
