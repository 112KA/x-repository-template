import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./global.css";
import { SiteHeader } from "@/components/site-header";
import { ViewTransition } from "react";

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
        {children}
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
  return (
    <>
      <SiteHeader />
      
      <ViewTransition>
        <main>
          <Outlet />
        </main>

      </ViewTransition>
    </>
  );
}
