import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DatePickerWithRange from "../ui/date-picker-with-range";
import { MapPin, Calendar, Clock, Navigation } from "lucide-react";
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

  // Get order type from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam && ["flight", "train", "vehicle"].includes(typeParam)) {
      setOrderType(typeParam);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the order to the backend
    navigate("/orders");
  };

  // Simulate calculating distance, duration and price
  const calculateRoute = () => {
    if (pickupLocation && dropoffLocation) {
      // This would normally call a mapping API
      // For demo purposes, we'll generate random values
      const randomDistance = Math.floor(Math.random() * 20) + 5; // 5-25 km
      const randomDuration =
        randomDistance * 2 + Math.floor(Math.random() * 10); // approx 2 min/km + random
      const basePrice = 10000; // Base price in IDR
      const pricePerKm = 5000; // Price per km in IDR
      const calculatedPrice = basePrice + randomDistance * pricePerKm;

      setDistance(randomDistance);
      setDuration(randomDuration);
      setPrice(calculatedPrice);
    }
  };

  const useMyLocation = () => {
    // This would normally use the browser's geolocation API
    // and then reverse geocode to get an address
    setPickupLocation("Current Location (Jl. Sudirman No. 123, Jakarta)");
    calculateRoute();
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
                            <Label htmlFor="pickupLocation">
                              Pickup Location
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <div className="flex-1">
                                <Input
                                  placeholder="Enter pickup address"
                                  value={pickupLocation}
                                  onChange={(e) =>
                                    setPickupLocation(e.target.value)
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-shrink-0 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                onClick={useMyLocation}
                              >
                                <Navigation className="h-4 w-4 mr-1" /> Lokasi
                                Saya
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="dropoffLocation">
                              Dropoff Location
                            </Label>
                            <Input
                              placeholder="Enter dropoff address"
                              value={dropoffLocation}
                              onChange={(e) =>
                                setDropoffLocation(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={calculateRoute}
                          disabled={!pickupLocation || !dropoffLocation}
                        >
                          Calculate Route
                        </Button>

                        {distance !== null &&
                          duration !== null &&
                          price !== null && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <h3 className="font-medium text-blue-800 mb-2">
                                Route Information
                              </h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col">
                                  <span className="text-sm text-blue-600">
                                    Distance
                                  </span>
                                  <span className="text-lg font-semibold">
                                    {distance} km
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-blue-600">
                                    Duration
                                  </span>
                                  <span className="text-lg font-semibold">
                                    {duration} min
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-blue-600">
                                    Estimated Price
                                  </span>
                                  <span className="text-lg font-semibold">
                                    Rp {price.toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="vehicleType">Vehicle Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mpv-regular">
                                  MPV Regular
                                </SelectItem>
                                <SelectItem value="mpv-premium">
                                  MPV Premium
                                </SelectItem>
                                <SelectItem value="electric">
                                  ELECTRIC (EV)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="duration">
                              Rental Duration (hours)
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
