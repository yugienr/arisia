import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { Database } from "@/types/supabase";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Package,
  BarChart2,
  Plane,
  Train,
  Car,
  CalendarDays,
  Settings,
  Save,
  DollarSign,
  CircleDollarSign,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../ui/loading-spinner";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

interface PricingSettings {
  distancePricePerKm: number;
  vehiclePrices: {
    mpvRegular: number;
    mpvPremium: number;
    electric: number;
  };
  parkingFee: number;
  surchargePercentage: number;
}

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [orderStats, setOrderStats] = useState<{ [key: string]: number }>({
    flight: 0,
    train: 0,
    vehicle: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    distancePricePerKm: 5000,
    vehiclePrices: {
      mpvRegular: 150000,
      mpvPremium: 250000,
      electric: 350000,
    },
    parkingFee: 10000,
    surchargePercentage: 10,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (ordersError) throw ordersError;
        setRecentOrders(orders || []);

        // Count users
        const { count: userCount, error: userCountError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        if (userCountError) throw userCountError;
        setUserCount(userCount || 0);

        // Count orders
        const { count: orderCount, error: orderCountError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        if (orderCountError) throw orderCountError;
        setOrderCount(orderCount || 0);

        // Get order stats by type
        const { data: flightOrders, error: flightError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("order_type", "flight");

        const { data: trainOrders, error: trainError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("order_type", "train");

        const { data: vehicleOrders, error: vehicleError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("order_type", "vehicle");

        if (flightError || trainError || vehicleError)
          throw new Error("Error fetching order stats");

        setOrderStats({
          flight: flightOrders?.length || 0,
          train: trainOrders?.length || 0,
          vehicle: vehicleOrders?.length || 0,
        });

        // Fetch pricing settings
        // In a real app, this would come from the database
        // For now, we'll use the default values set in state
        // This is where you would add the actual fetch from a settings table
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSavePricingSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to the database
      // For now, we'll just simulate a save with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would add the actual save to a settings table
      // const { error } = await supabase
      //   .from('pricing_settings')
      //   .upsert({
      //     distance_price_per_km: pricingSettings.distancePricePerKm,
      //     mpv_regular_price: pricingSettings.vehiclePrices.mpvRegular,
      //     mpv_premium_price: pricingSettings.vehiclePrices.mpvPremium,
      //     electric_price: pricingSettings.vehiclePrices.electric,
      //     parking_fee: pricingSettings.parkingFee,
      //     surcharge_percentage: pricingSettings.surchargePercentage,
      //   });

      // if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving pricing settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePricingChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;

    if (field === "distancePricePerKm") {
      setPricingSettings((prev) => ({ ...prev, distancePricePerKm: numValue }));
    } else if (field === "parkingFee") {
      setPricingSettings((prev) => ({ ...prev, parkingFee: numValue }));
    } else if (field === "surchargePercentage") {
      setPricingSettings((prev) => ({
        ...prev,
        surchargePercentage: numValue,
      }));
    } else if (
      field === "mpvRegular" ||
      field === "mpvPremium" ||
      field === "electric"
    ) {
      setPricingSettings((prev) => ({
        ...prev,
        vehiclePrices: {
          ...prev.vehiclePrices,
          [field]: numValue,
        },
      }));
    }
  };

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
    { icon: <BarChart2 size={20} />, label: "Dashboard", isActive: true },
    { icon: <Package size={20} />, label: "Orders" },
    { icon: <Users size={20} />, label: "Users" },
    { icon: <Settings size={20} />, label: "Settings" },
    { icon: <DollarSign size={20} />, label: "Pricing" },
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
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  Welcome back, {userData?.full_name || "Admin"}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button
                  onClick={() => navigate("/admin/users")}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Users className="mr-2 h-4 w-4" /> Manage Users
                </Button>
                <Button
                  onClick={() => navigate("/orders")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Package className="mr-2 h-4 w-4" /> View Orders
                </Button>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pricing">Pricing Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium text-gray-900">
                        Total Users
                      </CardTitle>
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <div className="text-3xl font-bold text-gray-900">
                          {userCount}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Registered users
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium text-gray-900">
                        Total Orders
                      </CardTitle>
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <div className="text-3xl font-bold text-gray-900">
                          {orderCount}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Processed orders
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-medium text-gray-900">
                        Revenue
                      </CardTitle>
                      <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                        <BarChart2 className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <div className="text-3xl font-bold text-gray-900">
                          Rp{" "}
                          {recentOrders
                            .reduce(
                              (sum, order) => sum + Number(order.total_price),
                              0,
                            )
                            .toLocaleString("id-ID")}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Total revenue
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Type Distribution */}
                <Card className="bg-white rounded-xl shadow-sm mb-8">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Order Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Plane className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Flight Bookings
                          </p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {orderStats.flight}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Train className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Train Bookings
                          </p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {orderStats.train}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <Car className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Vehicle Rentals
                          </p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {orderStats.vehicle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Route
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {order.id.substring(0, 8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    {getOrderIcon(order.order_type)}
                                    <span className="ml-2 capitalize">
                                      {order.order_type}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {order.departure} → {order.destination}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(order.departure_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                                  >
                                    {order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  Rp {order.total_price.toLocaleString("id-ID")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button
                                    onClick={() =>
                                      navigate(`/orders/${order.id}`)
                                    }
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                    size="sm"
                                  >
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <Card className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-gray-500">
                          There are no orders in the system yet.
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-8">
                <Card className="bg-white rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                      Vehicle Rental Pricing Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-md font-medium mb-3 flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            Distance Pricing
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                Price per Kilometer (Rp)
                              </label>
                              <Input
                                type="number"
                                value={pricingSettings.distancePricePerKm}
                                onChange={(e) =>
                                  handlePricingChange(
                                    "distancePricePerKm",
                                    e.target.value,
                                  )
                                }
                                className="max-w-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-md font-medium mb-3 flex items-center">
                            <Car className="h-4 w-4 mr-2 text-green-500" />
                            Vehicle Type Pricing
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                MPV Regular (Rp)
                              </label>
                              <Input
                                type="number"
                                value={pricingSettings.vehiclePrices.mpvRegular}
                                onChange={(e) =>
                                  handlePricingChange(
                                    "mpvRegular",
                                    e.target.value,
                                  )
                                }
                                className="max-w-xs"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                MPV Premium (Rp)
                              </label>
                              <Input
                                type="number"
                                value={pricingSettings.vehiclePrices.mpvPremium}
                                onChange={(e) =>
                                  handlePricingChange(
                                    "mpvPremium",
                                    e.target.value,
                                  )
                                }
                                className="max-w-xs"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                Electric Vehicle (Rp)
                              </label>
                              <Input
                                type="number"
                                value={pricingSettings.vehiclePrices.electric}
                                onChange={(e) =>
                                  handlePricingChange(
                                    "electric",
                                    e.target.value,
                                  )
                                }
                                className="max-w-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-md font-medium mb-3 flex items-center">
                            <CircleDollarSign className="h-4 w-4 mr-2 text-orange-500" />
                            Additional Fees
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                Parking Fee (Rp)
                              </label>
                              <Input
                                type="number"
                                value={pricingSettings.parkingFee}
                                onChange={(e) =>
                                  handlePricingChange(
                                    "parkingFee",
                                    e.target.value,
                                  )
                                }
                                className="max-w-xs"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">
                                Surcharge Percentage (%)
                              </label>
                              <Input
                                type="number"
                                value={pricingSettings.surchargePercentage}
                                onChange={(e) =>
                                  handlePricingChange(
                                    "surchargePercentage",
                                    e.target.value,
                                  )
                                }
                                className="max-w-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <Card className="bg-gray-50 border border-gray-200">
                            <CardContent className="pt-6">
                              <h4 className="text-sm font-medium mb-2">
                                Pricing Example
                              </h4>
                              <p className="text-sm text-gray-500 mb-4">
                                For a 10km trip with MPV Regular:
                              </p>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Base price (MPV Regular):</span>
                                  <span>
                                    Rp{" "}
                                    {pricingSettings.vehiclePrices.mpvRegular.toLocaleString(
                                      "id-ID",
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Distance charge (10km):</span>
                                  <span>
                                    Rp{" "}
                                    {(
                                      pricingSettings.distancePricePerKm * 10
                                    ).toLocaleString("id-ID")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Parking fee:</span>
                                  <span>
                                    Rp{" "}
                                    {pricingSettings.parkingFee.toLocaleString(
                                      "id-ID",
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>
                                    Rp{" "}
                                    {(
                                      pricingSettings.vehiclePrices.mpvRegular +
                                      pricingSettings.distancePricePerKm * 10 +
                                      pricingSettings.parkingFee
                                    ).toLocaleString("id-ID")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>
                                    Surcharge (
                                    {pricingSettings.surchargePercentage}%):
                                  </span>
                                  <span>
                                    Rp{" "}
                                    {(
                                      ((pricingSettings.vehiclePrices
                                        .mpvRegular +
                                        pricingSettings.distancePricePerKm *
                                          10 +
                                        pricingSettings.parkingFee) *
                                        pricingSettings.surchargePercentage) /
                                      100
                                    ).toLocaleString("id-ID")}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                                  <span>Total:</span>
                                  <span>
                                    Rp{" "}
                                    {(
                                      (pricingSettings.vehiclePrices
                                        .mpvRegular +
                                        pricingSettings.distancePricePerKm *
                                          10 +
                                        pricingSettings.parkingFee) *
                                      (1 +
                                        pricingSettings.surchargePercentage /
                                          100)
                                    ).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center">
                      <Button
                        onClick={handleSavePricingSettings}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" /> Save Settings
                          </>
                        )}
                      </Button>
                      {saveSuccess && (
                        <span className="ml-4 text-green-600 text-sm flex items-center">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Settings saved successfully
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
