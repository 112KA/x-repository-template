import type { ReactNode } from "react";
import {
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./global.css";

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
      <header>
        <nav aria-label="メインナビゲーション">
          <Link to="/">トップページ</Link>
          <Link to="/sub/">サブページ</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
