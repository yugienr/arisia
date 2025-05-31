import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, this would fetch the order details from the backend
  const orderType =
    parseInt(id || "0") % 3 === 0
      ? "Flight"
      : parseInt(id || "0") % 2 === 0
        ? "Train"
        : "Vehicle";
  const status = parseInt(id || "0") % 2 === 0 ? "Completed" : "Pending";

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center gap-2"
        onClick={() => navigate("/orders")}
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{id}</h1>
          <p className="text-gray-500">
            Created on {new Date().toLocaleDateString()}
          </p>
        </div>
        <Badge
          className={
            status === "Completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Information about your {orderType.toLowerCase()} booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Type</h3>
                <p>{orderType}</p>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <div>
                  <p className="font-medium">Jakarta → Surabaya</p>
                  <p className="text-sm text-gray-500">Route</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <div>
                  <p className="font-medium">June 15, 2024</p>
                  <p className="text-sm text-gray-500">Departure Date</p>
                </div>
              </div>

              {orderType === "Flight" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Airline</h3>
                      <p>Garuda Indonesia</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Class</h3>
                      <p>Economy</p>
                    </div>
                  </div>
                </>
              )}

              {orderType === "Train" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Train Class</h3>
                      <p>Executive</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Passengers</h3>
                      <p>2</p>
                    </div>
                  </div>
                </>
              )}

              {orderType === "Vehicle" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Vehicle Type</h3>
                      <p>Car</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Rental Duration</h3>
                      <p>3 days</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h3 className="font-medium">Additional Notes</h3>
                <p className="text-gray-600">
                  {parseInt(id || "0") % 2 === 0
                    ? "Please provide vegetarian meal options."
                    : "No special requirements."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Base fare</span>
                <span>Rp 750,000</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rp 75,000</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>Rp 25,000</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp 850,000</span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                {status === "Pending" ? (
                  <Button className="w-full">Pay Now</Button>
                ) : (
                  <Badge className="w-full justify-center py-2 bg-green-100 text-green-800">
                    Paid on {new Date().toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
