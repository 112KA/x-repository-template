import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 border-b bg-background p-4">
      <NavigationMenu aria-label="メインナビゲーション">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/" />}>トップページ</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link to="/sub/" />}>サブページ</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
