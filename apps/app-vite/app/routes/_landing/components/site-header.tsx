import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { ThemeSwitch } from "./theme-switch";

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function SiteHeader() {
  const isClient = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, setTheme } = useTheme();
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
    <header className="sticky top-0 flex min-h-14 items-center justify-between gap-4 border-b bg-background p-4">
      <NavigationMenu className="hidden md:flex" aria-label="メインナビゲーション">
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/" />}>トップページ</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/sub/" />}>サブページ</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:block">
          <ThemeSwitch isDark={isDark} setTheme={setTheme} />
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
            <SheetHeader>
              <SheetTitle>メニュー</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4" aria-label="メインナビゲーション">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-4 py-3 text-base transition-colors hover:bg-muted"
              >
                トップページ
              </Link>
              <Link
                to="/sub/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-4 py-3 text-base transition-colors hover:bg-muted"
              >
                サブページ
              </Link>
            </nav>
            <div className="mt-4 px-4">
              <ThemeSwitch isDark={isDark} setTheme={setTheme} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
