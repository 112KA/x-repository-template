import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ViewTransition } from "react";
import { Link, Outlet, useLocation } from "react-router";

const examplePages = [
  { label: "test1", to: "/examples/test1" },
  { label: "test2", to: "/examples/test2" },
];

export default function ExamplesLayout() {
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">Examples</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {examplePages.map(({ label, to }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      isActive={pathname.replace(/\/$/, "") === to}
                      render={<Link to={to} />}
                    >
                      {label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="font-medium">Examples</span>
        </header>
        <div className="flex-1 p-6">
          <ViewTransition name="route-content">
            <Outlet />
          </ViewTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
