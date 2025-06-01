import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../../supabase/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import {
  Plane,
  Train,
  Car,
  Download,
  Calendar,
  MapPin,
  Clock,
  FileText,
  History,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { LoadingSpinner } from "../ui/loading-spinner";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";

type Order = {
  id: string;
  order_type: string;
  status: string;
  departure: string;
  destination: string;
  departure_date: string;
  created_at: string;
  total_price: number;
  passenger_count?: number;
  details?: any;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderIcon = (orderType: string, size = 20) => {
    switch (orderType) {
      case "flight":
        return <Plane size={size} className="text-blue-500" />;
      case "train":
        return <Train size={size} className="text-green-500" />;
      case "vehicle":
        return <Car size={size} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    let color = "";
    switch (status) {
      case "confirmed":
        color = "bg-green-100 text-green-800 border-green-200";
        break;
      case "pending":
        color = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "cancelled":
        color = "bg-red-100 text-red-800 border-red-200";
        break;
      case "completed":
        color = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      default:
        color = "bg-gray-100 text-gray-800 border-gray-200";
    }
    return (
      <Badge variant="outline" className={`${color} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleDownload = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    // In a real app, this would generate and download a receipt
    alert(`Downloading receipt for order ${order.id}`);
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.order_type === activeTab);

  const navItems = [
    { icon: <Calendar size={20} />, label: "Dashboard", href: "/dashboard" },
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
    {
      icon: <FileText size={20} />,
      label: "My Orders",
      href: "/orders",
      isActive: true,
    },
    {
      icon: <History size={20} />,
      label: "History",
      href: "/history",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="My Orders" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                My Orders
              </h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/new-order?type=flight")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plane className="h-4 w-4 mr-1" /> Book Flight
                </Button>
                <Button
                  onClick={() => navigate("/new-order?type=train")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Train className="h-4 w-4 mr-1" /> Book Train
                </Button>
                <Button
                  onClick={() => navigate("/new-order?type=vehicle")}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Car className="h-4 w-4 mr-1" /> Rent Vehicle
                </Button>
              </div>
            </div>

            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
                <TabsTrigger value="all" className="text-sm">
                  All Orders
                </TabsTrigger>
                <TabsTrigger value="flight" className="text-sm">
                  <Plane className="h-4 w-4 mr-1" /> Flight Tickets
                </TabsTrigger>
                <TabsTrigger value="vehicle" className="text-sm">
                  <Car className="h-4 w-4 mr-1" /> Booking Car
                </TabsTrigger>
                <TabsTrigger value="train" className="text-sm">
                  <Train className="h-4 w-4 mr-1" /> Train Tickets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {renderOrdersList(filteredOrders)}
              </TabsContent>
              <TabsContent value="flight" className="mt-0">
                {renderOrdersList(filteredOrders)}
              </TabsContent>
              <TabsContent value="vehicle" className="mt-0">
                {renderOrdersList(filteredOrders)}
              </TabsContent>
              <TabsContent value="train" className="mt-0">
                {renderOrdersList(filteredOrders)}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );

  function renderOrdersList(ordersList: Order[]) {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      );
    }

    if (ordersList.length === 0) {
      return (
        <Card className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            {activeTab === "all" ? (
              <>
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Clock className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md text-center">
                  You haven't made any bookings yet. Start by booking a flight,
                  train, or renting a vehicle.
                </p>
              </>
            ) : (
              <>
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  {getOrderIcon(activeTab, 40)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No{" "}
                  {activeTab === "flight"
                    ? "flight tickets"
                    : activeTab === "train"
                      ? "train tickets"
                      : "vehicle bookings"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md text-center">
                  You haven't made any{" "}
                  {activeTab === "flight"
                    ? "flight"
                    : activeTab === "train"
                      ? "train"
                      : "vehicle"}{" "}
                  bookings yet.
                </p>
              </>
            )}
            <div className="flex gap-2">
              {(activeTab === "all" || activeTab === "flight") && (
                <Button
                  onClick={() => navigate("/new-order?type=flight")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plane className="h-4 w-4 mr-1" /> Book Flight
                </Button>
              )}
              {(activeTab === "all" || activeTab === "train") && (
                <Button
                  onClick={() => navigate("/new-order?type=train")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Train className="h-4 w-4 mr-1" /> Book Train
                </Button>
              )}
              {(activeTab === "all" || activeTab === "vehicle") && (
                <Button
                  onClick={() => navigate("/new-order?type=vehicle")}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Car className="h-4 w-4 mr-1" /> Rent Vehicle
                </Button>
              )}
            </div>
          </div>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {ordersList.map((order) => (
          <Card
            key={order.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="md:w-1/4 p-6 flex flex-col justify-center items-center md:border-r border-gray-100"
                style={{
                  backgroundColor:
                    order.order_type === "flight"
                      ? "#EBF5FF"
                      : order.order_type === "train"
                        ? "#ECFDF5"
                        : "#FFF7ED",
                }}
              >
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                  {getOrderIcon(order.order_type, 32)}
                </div>
                <h3 className="text-lg font-semibold text-center capitalize">
                  {order.order_type === "flight"
                    ? "Flight Ticket"
                    : order.order_type === "train"
                      ? "Train Ticket"
                      : "Vehicle Rental"}
                </h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  Order #{order.id.substring(0, 8)}
                </p>
                {getStatusBadge(order.status)}
              </div>

              <div
                className="md:w-3/4 p-6 cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {order.departure} to {order.destination}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(order.departure_date)}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatTime(order.departure_date)}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {order.total_price.toLocaleString("id-ID")}
                    </p>
                    {order.passenger_count && (
                      <p className="text-sm text-gray-500">
                        {order.passenger_count} Passenger
                        {order.passenger_count > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={(e) => handleDownload(e, order)}
                  >
                    <Download className="h-4 w-4 mr-1" /> Download Receipt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
}
