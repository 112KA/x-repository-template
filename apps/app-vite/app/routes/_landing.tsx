import { SiteHeader } from "@/routes/_landing/components/site-header";
import { Outlet } from "react-router";
import { ViewTransition } from "react";

export default function SiteLayout() {
  return (
    <>
      <SiteHeader />

      <ViewTransition name="route-content">
        <main>
          <Outlet />
        </main>
      </ViewTransition>
    </>
  );
}
