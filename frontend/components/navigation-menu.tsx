// import { Link } from "next/link"
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { SidebarTrigger } from "./ui/sidebar"


export function NavigationMenuBar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <SidebarTrigger />

                </NavigationMenuItem>
                {/* <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/docs">Documentation</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem> */}
            </NavigationMenuList>
        </NavigationMenu>
    )
}