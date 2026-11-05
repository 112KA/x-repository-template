import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeSwitch } from "./theme-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 flex items-center justify-between gap-4 border-b bg-background p-4">
      <NavigationMenu aria-label="メインナビゲーション">
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/" />}>トップページ</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/sub/" />}>サブページ</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ThemeSwitch />
    </header>
  );
}
