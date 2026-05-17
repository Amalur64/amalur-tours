import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Applique le middleware uniquement aux pages (pas aux fichiers statiques, sitemap, robots, api...)
  matcher: [
    "/((?!_next|_vercel|.*\\..*|api|sitemap\\.xml|robots\\.txt|favicon\\.ico|icon\\.png|icon\\.svg|apple-icon\\.png|images).*)",
  ],
};
