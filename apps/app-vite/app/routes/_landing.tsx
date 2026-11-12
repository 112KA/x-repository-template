import { SiteHeader } from "@/routes/_landing/components/site-header";
import { Outlet } from "react-router";
import { ViewTransition } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function SiteLayout() {
  return (
    <>
      <ReactLenis root />
      <div className="bg-background">
        <SiteHeader />

        <ViewTransition name="route-content">
          <Outlet />
        </ViewTransition>
      </div>
    </>
  );
}
