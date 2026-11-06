import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./css/global.css";
import { useViewportHeight } from "./hooks/use-viewport-height";
import { ThemeProvider } from "./features/theme/theme-provider";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function meta() {
  return [{ title: "app-vite" }];
}

export default function App() {
  useViewportHeight();

  return (
    <div className="min-h-viewport">
      <Outlet />
    </div>
  );
}
