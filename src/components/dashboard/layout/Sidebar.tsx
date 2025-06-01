import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  Plane,
  Car,
  Train,
  Package,
  Clock,
  CalendarDays,
  FileText,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const defaultNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: "Home", href: "/" },
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: <Plane size={20} />,
    label: "Flight Tickets",
    href: "/new-order?type=flight",
  },
  {
    icon: <Car size={20} />,
    label: "Booking Car",
    href: "/new-order?type=vehicle",
  },
  {
    icon: <Train size={20} />,
    label: "Train Tickets",
    href: "/new-order?type=train",
  },
  { icon: <FileText size={20} />, label: "My Orders", href: "/orders" },
  { icon: <History size={20} />, label: "History", href: "/history" },
];

const defaultBottomItems: NavItem[] = [
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  { icon: <HelpCircle size={20} />, label: "Help", href: "/help" },
];

const Sidebar = ({
  items = defaultNavItems,
  activeItem,
  onItemClick = () => {},
}: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentQuery = location.search;

  const isActive = (item: NavItem) => {
    if (!item.href) return false;
    if (item.href === currentPath) return true;
    if (item.href.includes("?") && currentPath + currentQuery === item.href)
      return true;
    if (item.label === "My Orders" && currentPath.startsWith("/orders"))
      return true;
    if (item.label === "History" && currentPath.startsWith("/history"))
      return true;
    if (item.label === "Dashboard" && currentPath === "/dashboard") return true;
    return activeItem === item.label;
  };

  return (
    <div className="w-[280px] h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Travel App</h2>
        <p className="text-sm text-gray-500">Manage your travel bookings</p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1.5">
          {items.map((item) => (
            <Button
              key={item.label}
              variant={"ghost"}
              className={`w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium ${isActive(item) ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => onItemClick(item.label)}
              asChild
            >
              <Link to={item.href || "#"}>
                <span
                  className={`${isActive(item) ? "text-blue-600" : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4 bg-gray-100" />

        <div className="space-y-3">
          <h3 className="text-xs font-medium px-4 py-1 text-gray-500 uppercase tracking-wider">
            Status
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Active
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
            Pending
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-9 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            Completed
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-gray-200">
        {defaultBottomItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 mb-1.5"
            onClick={() => onItemClick(item.label)}
            asChild
          >
            <Link to={item.href || "#"}>
              <span className="text-gray-500">{item.icon}</span>
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
