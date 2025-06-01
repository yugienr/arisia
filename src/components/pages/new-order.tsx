import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DatePickerWithRange from "../ui/date-picker-with-range";
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Car,
  AlertCircle,
} from "lucide-react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderType, setOrderType] = useState("flight");
  const [bookingType, setBookingType] = useState("instant"); // instant or scheduled
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("mpv-regular");
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useAuth();

  // Get order type from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam && ["flight", "train", "vehicle"].includes(typeParam)) {
      setOrderType(typeParam);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupLocation || !dropoffLocation || !price || !userData) return;

    const { error } = await supabase.from("orders").insert({
      user_id: userData.id,
      order_type: "vehicle",
      departure: pickupLocation,
      destination: dropoffLocation,
      departure_date: new Date().toISOString(),
      status: "pending",
      total_price: price,
      passenger_count: 1,
    });

    if (error) {
      console.error("Failed to create vehicle order:", error.message);
      alert("Failed to create order.");
    } else {
      navigate("/orders");
    }
  };

  // Vehicle type pricing data
  const vehiclePricing = {
    "mpv-regular": { basePrice: 10000, pricePerKm: 5000, pricePerMinute: 500 },
    "mpv-premium": { basePrice: 15000, pricePerKm: 7000, pricePerMinute: 700 },
    electric: { basePrice: 20000, pricePerKm: 8000, pricePerMinute: 800 },
  };

  // Calculate price based on vehicle type, distance and duration
  const calculatePrice = (
    vehicleType: string,
    distanceKm: number,
    durationMin: number,
  ) => {
    const pricing = vehiclePricing[vehicleType as keyof typeof vehiclePricing];
    return (
      pricing.basePrice +
      distanceKm * pricing.pricePerKm +
      durationMin * pricing.pricePerMinute
    );
  };

  // Simulate calculating distance, duration and price
  const calculateRoute = () => {
    if (pickupLocation && dropoffLocation) {
      setIsCalculating(true);
      setError(null);

      // Simulate API call with a delay
      setTimeout(() => {
        try {
          // This would normally call a mapping API like Google Maps
          // For demo purposes, we'll generate realistic values
          const randomDistance = Math.floor(Math.random() * 20) + 5; // 5-25 km
          const randomDuration =
            randomDistance * 2 + Math.floor(Math.random() * 10); // approx 2 min/km + random
          const calculatedPrice = calculatePrice(
            selectedVehicleType,
            randomDistance,
            randomDuration,
          );

          setDistance(randomDistance);
          setDuration(randomDuration);
          setPrice(calculatedPrice);
          setIsCalculating(false);
        } catch (err) {
          setError("Failed to calculate route. Please try again.");
          setIsCalculating(false);
        }
      }, 1500); // Simulate network delay
    }
  };

  // Recalculate price when vehicle type changes
  useEffect(() => {
    if (distance !== null && duration !== null) {
      const newPrice = calculatePrice(selectedVehicleType, distance, duration);
      setPrice(newPrice);
    }
  }, [selectedVehicleType, distance, duration]);

  const useMyLocation = () => {
    setError(null);
    // Simulate getting user's location with browser's geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we would use reverse geocoding here
        // For demo, we'll just use a hardcoded address
        setPickupLocation("Current Location (Jl. Sudirman No. 123, Jakarta)");
        if (dropoffLocation) {
          calculateRoute();
        }
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Could not access your location. Please enter manually.");
        // Fallback for demo purposes
        setPickupLocation("Current Location (Jl. Sudirman No. 123, Jakarta)");
      },
      { timeout: 10000 },
    );
  };

  const navItems = [
    { icon: <Calendar size={20} />, label: "Dashboard", href: "/dashboard" },
    {
      icon: <Clock size={20} />,
      label: "New Order",
      href: "/new-order",
      isActive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="New Order" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Dashboard
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Create New Order
              </h1>
            </div>

            <Tabs
              defaultValue={orderType}
              value={orderType}
              onValueChange={setOrderType}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
                <TabsTrigger value="flight" className="text-sm">
                  Book Flight
                </TabsTrigger>
                <TabsTrigger value="train" className="text-sm">
                  Book Train
                </TabsTrigger>
                <TabsTrigger value="vehicle" className="text-sm">
                  Rent Vehicle
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flight">
                <Card>
                  <CardHeader>
                    <CardTitle>Flight Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="departure">Departure City</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jakarta">Jakarta</SelectItem>
                                <SelectItem value="surabaya">
                                  Surabaya
                                </SelectItem>
                                <SelectItem value="bandung">Bandung</SelectItem>
                                <SelectItem value="yogyakarta">
                                  Yogyakarta
                                </SelectItem>
                                <SelectItem value="bali">Bali</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="destination">
                              Destination City
                            </Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jakarta">Jakarta</SelectItem>
                                <SelectItem value="surabaya">
                                  Surabaya
                                </SelectItem>
                                <SelectItem value="bandung">Bandung</SelectItem>
                                <SelectItem value="yogyakarta">
                                  Yogyakarta
                                </SelectItem>
                                <SelectItem value="bali">Bali</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Travel Date</Label>
                          <div className="mt-2">
                            <DatePickerWithRange />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="airline">Airline</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select airline" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="garuda">
                                  Garuda Indonesia
                                </SelectItem>
                                <SelectItem value="lionair">
                                  Lion Air
                                </SelectItem>
                                <SelectItem value="airasia">
                                  Air Asia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="class">Class</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="economy">Economy</SelectItem>
                                <SelectItem value="business">
                                  Business
                                </SelectItem>
                                <SelectItem value="first">
                                  First Class
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="passengers">
                              Number of Passengers
                            </Label>
                            <Input type="number" min="1" defaultValue="1" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Input
                            id="notes"
                            placeholder="Any special requirements or notes"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => navigate("/orders")}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Book Flight</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="train">
                <Card>
                  <CardHeader>
                    <CardTitle>Train Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="departure">Departure Station</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select station" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jakarta">
                                  Jakarta (Gambir)
                                </SelectItem>
                                <SelectItem value="bandung">
                                  Bandung (Hall)
                                </SelectItem>
                                <SelectItem value="yogyakarta">
                                  Yogyakarta (Tugu)
                                </SelectItem>
                                <SelectItem value="surabaya">
                                  Surabaya (Gubeng)
                                </SelectItem>
                                <SelectItem value="semarang">
                                  Semarang (Tawang)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="destination">
                              Destination Station
                            </Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select station" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jakarta">
                                  Jakarta (Gambir)
                                </SelectItem>
                                <SelectItem value="bandung">
                                  Bandung (Hall)
                                </SelectItem>
                                <SelectItem value="yogyakarta">
                                  Yogyakarta (Tugu)
                                </SelectItem>
                                <SelectItem value="surabaya">
                                  Surabaya (Gubeng)
                                </SelectItem>
                                <SelectItem value="semarang">
                                  Semarang (Tawang)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Travel Date</Label>
                          <div className="mt-2">
                            <DatePickerWithRange />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="trainClass">Train Class</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="economy">Economy</SelectItem>
                                <SelectItem value="business">
                                  Business
                                </SelectItem>
                                <SelectItem value="executive">
                                  Executive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="passengers">
                              Number of Passengers
                            </Label>
                            <Input type="number" min="1" defaultValue="1" />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Input
                            id="notes"
                            placeholder="Any special requirements or notes"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => navigate("/orders")}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Book Train</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vehicle">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Rental Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bookingType">Booking Type</Label>
                          <RadioGroup
                            defaultValue="instant"
                            value={bookingType}
                            onValueChange={setBookingType}
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="instant" id="instant" />
                              <Label htmlFor="instant">Today (Instant)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="scheduled"
                                id="scheduled"
                              />
                              <Label htmlFor="scheduled">
                                Schedule for Later
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {bookingType === "scheduled" && (
                          <div>
                            <Label>Rental Date</Label>
                            <div className="mt-2">
                              <DatePickerWithRange />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label
                              htmlFor="pickupLocation"
                              className="flex items-center gap-2"
                            >
                              <MapPin size={16} className="text-blue-600" />
                              Pickup Location
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <div className="flex-1 relative">
                                <Input
                                  placeholder="Enter pickup address"
                                  value={pickupLocation}
                                  onChange={(e) => {
                                    setPickupLocation(e.target.value);
                                    setDistance(null);
                                    setDuration(null);
                                    setPrice(null);
                                  }}
                                  className="pl-10 pr-4 py-2 h-11"
                                />
                                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-shrink-0 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 h-11"
                                onClick={useMyLocation}
                              >
                                <Navigation className="h-4 w-4 mr-1" /> Lokasi
                                Saya
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="dropoffLocation"
                              className="flex items-center gap-2"
                            >
                              <MapPin size={16} className="text-red-500" />
                              Dropoff Location
                            </Label>
                            <div className="relative">
                              <Input
                                placeholder="Enter dropoff address"
                                value={dropoffLocation}
                                onChange={(e) => {
                                  setDropoffLocation(e.target.value);
                                  setDistance(null);
                                  setDuration(null);
                                  setPrice(null);
                                }}
                                className="pl-10 pr-4 py-2 h-11"
                              />
                              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {error && (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 h-11 font-medium"
                          onClick={calculateRoute}
                          disabled={
                            !pickupLocation || !dropoffLocation || isCalculating
                          }
                        >
                          {isCalculating ? (
                            <>
                              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Calculating...
                            </>
                          ) : (
                            "Calculate Route"
                          )}
                        </Button>

                        {distance !== null &&
                          duration !== null &&
                          price !== null && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Route Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col bg-white p-3 rounded-lg border border-blue-100">
                                  <span className="text-sm text-blue-600 mb-1">
                                    Distance
                                  </span>
                                  <span className="text-lg font-semibold">
                                    {distance} km
                                  </span>
                                </div>
                                <div className="flex flex-col bg-white p-3 rounded-lg border border-blue-100">
                                  <span className="text-sm text-blue-600 mb-1">
                                    Duration
                                  </span>
                                  <span className="text-lg font-semibold">
                                    {duration} min
                                  </span>
                                </div>
                                <div className="flex flex-col bg-white p-3 rounded-lg border border-blue-100">
                                  <span className="text-sm text-blue-600 mb-1">
                                    Estimated Price
                                  </span>
                                  <span className="text-lg font-semibold">
                                    Rp {price.toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 text-xs text-blue-700">
                                <p>Price breakdown:</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  <li>
                                    Base fare: Rp{" "}
                                    {vehiclePricing[
                                      selectedVehicleType as keyof typeof vehiclePricing
                                    ].basePrice.toLocaleString("id-ID")}
                                  </li>
                                  <li>
                                    Distance ({distance} km): Rp{" "}
                                    {(
                                      distance *
                                      vehiclePricing[
                                        selectedVehicleType as keyof typeof vehiclePricing
                                      ].pricePerKm
                                    ).toLocaleString("id-ID")}
                                  </li>
                                  <li>
                                    Duration ({duration} min): Rp{" "}
                                    {(
                                      duration *
                                      vehiclePricing[
                                        selectedVehicleType as keyof typeof vehiclePricing
                                      ].pricePerMinute
                                    ).toLocaleString("id-ID")}
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="vehicleType">Vehicle Type1</Label>
                            <Select
                              value={selectedVehicleType}
                              onValueChange={setSelectedVehicleType}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="mpv-regular"
                                  className="flex items-center"
                                >
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span>MPV Regular</span>
                                    <span className="ml-auto text-xs text-gray-500">
                                      Rp 5.000/km
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="mpv-premium">
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span>MPV Premium</span>
                                    <span className="ml-auto text-xs text-gray-500">
                                      Rp 7.000/km
                                    </span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="electric">
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span>ELECTRIC (EV)</span>
                                    <span className="ml-auto text-xs text-gray-500">
                                      Rp 8.000/km
                                    </span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="duration">
                              Rental Duration (hours)
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              defaultValue="1"
                              className="h-11"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Input
                            id="notes"
                            placeholder="Any special requirements or notes"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => navigate("/orders")}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Rent Vehicle</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
