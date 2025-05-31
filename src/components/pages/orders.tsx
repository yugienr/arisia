import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useAuth } from "../../../supabase/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";

type Order = {
  id: string;
  order_type: string;
  status: string;
  departure: string;
  destination: string;
  departure_date: string;
  created_at: string;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Your Orders</h1>
        </div>
        <Button onClick={() => navigate("/new-order")}>New Order</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">
                    Order #{order.id.substring(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    Created on {formatDate(order.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium capitalize">
                        {order.order_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">From - To</p>
                      <p className="font-medium">
                        {order.departure} - {order.destination}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Departure Date</p>
                      <p className="font-medium">
                        {formatDate(order.departure_date)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500 mb-4">
                You don't have any orders yet
              </p>
              <Button onClick={() => navigate("/new-order")}>
                Create your first order
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
