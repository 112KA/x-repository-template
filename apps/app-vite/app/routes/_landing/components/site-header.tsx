import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { ThemeSwitch } from "@/features/theme/ui/theme-switch";

const navigationItems = [
  { label: "トップページ", to: "/" },
  { label: "サブページ", to: "/sub/" },
  { label: "Examples", to: "/examples/r3f" },
] as const;

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function SiteHeader() {
  const isClient = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      className="fixed top-4 right-4 z-[60] md:hidden"
      aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      {isMenuOpen ? <XIcon /> : <MenuIcon />}
    </Button>
  );

  return (
    <header className="sticky top-0 min-h-14 border-b bg-background py-4">
      <div className="container-px-4 flex justify-between xl:container-px-0">
        <NavigationMenu className="hidden md:flex" aria-label="メインナビゲーション">
          <NavigationMenuList className="gap-4">
            {navigationItems.map(({ label, to }) => (
              <NavigationMenuItem key={to}>
                <NavigationMenuLink render={<Link to={to} />}>{label}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeSwitch />
          </div>
          <Sheet open={isMenuOpen} onOpenChange={(open) => setIsMenuOpen(open)}>
            {isClient &&
              createPortal(
                <SheetTrigger
                  onClick={(event) => {
                    event.preventDefault();
                    setIsMenuOpen((open) => !open);
                  }}
                  render={menuButton}
                />,
                document.body,
              )}
            <SheetContent side="right" showCloseButton={false}>
              <SheetHeader className="flex-row justify-end p-3.5 pr-12">
                <ThemeSwitch />
              </SheetHeader>
              <nav className="stack-gap-2 px-4" aria-label="メインナビゲーション">
                {navigationItems.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-4 py-3 text-base transition-colors hover:bg-muted"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
