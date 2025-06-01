import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { Database } from "@/types/supabase";
import {
  CalendarDays,
  Clock,
  MapPin,
  Plane,
  Train,
  Car,
  Package,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../ui/loading-spinner";

type Order = Database["public"]["Tables"]["orders"]["Row"];

const CustomerDashboard = () => {
  const { userData } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!userData) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setRecentOrders(data || []);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [userData]);

  const getOrderIcon = (orderType: string) => {
    switch (orderType) {
      case "flight":
        return <Plane className="h-5 w-5 text-blue-500" />;
      case "train":
        return <Train className="h-5 w-5 text-green-500" />;
      case "vehicle":
        return <Car className="h-5 w-5 text-orange-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const navItems = [
    { icon: <CalendarDays size={20} />, label: "Dashboard", isActive: true },
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
    { icon: <Package size={20} />, label: "My Orders", href: "/orders" },
    { icon: <Clock size={20} />, label: "History", href: "/history" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="Dashboard" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome back, {userData?.full_name || "User"}
                </h1>
                <p className="text-gray-500 mt-1">
                  Here's what's happening with your travel plans.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={() => navigate("/new-order")}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-10 shadow-sm transition-colors"
                >
                  Book New Trip
                </Button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <Button
                  onClick={() => navigate("/orders")}
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View All
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {recentOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {getOrderIcon(order.order_type)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {order.departure} to {order.destination}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                                <span>{formatDate(order.departure_date)}</span>
                                <span className="mx-2">•</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              Rp {order.total_price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.passenger_count} Passenger
                              {order.passenger_count > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      You haven't made any bookings yet. Start by booking a
                      trip!
                    </p>
                    <Button
                      onClick={() => navigate("/new-order")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Book Now
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Service Cards */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Plane className="h-16 w-16 text-white opacity-75" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      Flight Tickets
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Book flights to domestic and international destinations
                    </p>
                    <Button
                      onClick={() => navigate("/new-order?type=flight")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Book Flight
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <Car className="h-16 w-16 text-white opacity-75" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      Vehicle Rental
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Rent vehicles for your journey or get pickup service
                    </p>
                    <Button
                      onClick={() => navigate("/new-order?type=vehicle")}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Rent Vehicle
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <Train className="h-16 w-16 text-white opacity-75" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      Train Tickets
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Book train tickets for comfortable travel
                    </p>
                    <Button
                      onClick={() => navigate("/new-order?type=train")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Book Train
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Profile Summary */}
            <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Profile
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">
                      {userData?.full_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">
                      {userData?.email || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium">
                      {userData?.phone_number || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Type</p>
                    <p className="font-medium capitalize">
                      {userData?.role || "Customer"}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
