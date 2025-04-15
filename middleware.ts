import {
  apiAuthPrefix,
  publicRoutes,
  restrictedRoutes,
} from "@/routes";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import NextAuth, { Session } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "./i18n-config";
import { env } from "process";
import authConfig from "./auth.config";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  return matchLocale(languages, locales, i18n.defaultLocale);
}

const { auth: middleware } = NextAuth(authConfig);

export default middleware((request: NextRequest & { auth: Session | null }) => {
  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!request.auth;
  const nextUrl = request.nextUrl;
  let response: NextResponse | undefined;

  // 忽略静态资源
  const ignoredPaths = [
    "/og.png", "/logo.png", "/favicon.ico", "/favicon-16x16.png",
    "/favicon-32x32.png", "/apple-touch-icon.png", "/android-chrome-192x192.png",
    "/android-chrome-512x512.png", "/site.webmanifest", "/robots.txt", "/sitemap.xml"
  ];
  if (ignoredPaths.includes(pathname) || pathname.startsWith("/images/")) {
    return NextResponse.next();
  }

  // 语言重定向
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    let redirectUrl = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;

    if (request.nextUrl.search) {
      redirectUrl += request.nextUrl.search;
    }

    if (
      redirectUrl.startsWith("/zh") ||
      redirectUrl.startsWith("/en") ||
      redirectUrl.startsWith("/fr")
    ) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      return NextResponse.next(); // fallback 如果不是合法语言路径
    }
  }

  // auth 验证
  let nextPath = nextUrl.pathname;
  i18n.locales.forEach(locale => {
    nextPath = nextPath.replace(new RegExp(`^/${locale}`), "");
  });
  const nextPathWithoutLocale = nextPath === "" ? "/" : nextPath;

  const isRestricted = restrictedRoutes.some(route =>
    nextPathWithoutLocale.startsWith(route)
  );

  if (isRestricted && !isLoggedIn) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
  }

  const isApiAuth = nextPathWithoutLocale.startsWith(apiAuthPrefix);
  if (isApiAuth) {
    return NextResponse.next();
  }

  const isPublic = publicRoutes.some(route =>
    route === "/" ? nextPathWithoutLocale === route : nextPathWithoutLocale.startsWith(route)
  );

  if (!isLoggedIn && !isPublic) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl));
  }

  return NextResponse.next(); // 默认继续
});

// 配置匹配规则
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
