import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
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
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Navigation,
  Car,
  AlertCircle,
  CreditCard,
  Wallet,
  Building,
  Landmark,
  QrCode,
  Shield,
  ChevronRight,
  Info,
  CheckCircle2,
  Users,
  CalendarDays,
} from "lucide-react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";

export default function VehicleBookingPage() {
  const navigate = useNavigate();
  const [bookingStep, setBookingStep] = useState(1); // 1: Search, 2: Select Vehicle, 3: Payment
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("mpv-regular");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [passengerCount, setPassengerCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Vehicle type pricing data
  const vehiclePricing = {
    "mpv-regular": {
      basePrice: 10000,
      pricePerKm: 5000,
      pricePerMinute: 500,
      name: "MPV Regular",
      capacity: 4,
      image:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
    },
    "mpv-premium": {
      basePrice: 15000,
      pricePerKm: 7000,
      pricePerMinute: 700,
      name: "MPV Premium",
      capacity: 6,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    },
    electric: {
      basePrice: 20000,
      pricePerKm: 8000,
      pricePerMinute: 800,
      name: "Electric Vehicle",
      capacity: 4,
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    },
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
          setBookingStep(2); // Move to vehicle selection step
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

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "TRAVEL10") {
      setIsPromoApplied(true);
      setDiscount(price ? price * 0.1 : 0); // 10% discount
      setPromoCode("");
    } else {
      setError("Invalid promo code. Try TRAVEL10 for 10% off.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      setError(null);

      // Import supabase client
      const { supabase } = await import("../../../supabase/supabase");

      // Create order in database
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            order_type: "vehicle",
            pickup_location: pickupLocation,
            dropoff_location: dropoffLocation,
            distance_km: distance,
            duration_min: duration,
            vehicle_type: selectedVehicleType,
            vehicle_name:
              vehiclePricing[selectedVehicleType as keyof typeof vehiclePricing]
                .name,
            passenger_count: passengerCount,
            pickup_date: date ? date.toISOString() : null,
            pickup_time: time,
            payment_method: paymentMethod,
            price_amount: price,
            discount_amount: discount,
            total_amount: price! - discount,
            status: "confirmed",
            notes: promoCode ? `Promo code applied: ${promoCode}` : null,
          },
        ])
        .select();

      if (error) {
        console.error("Error saving order:", error);
        setError("Failed to save your booking. Please try again.");
        setIsProcessingPayment(false);
        return;
      }

      console.log("Order saved successfully:", data);
      // Set booking as confirmed to show confirmation screen
      setIsBookingConfirmed(true);
      setIsProcessingPayment(false);
    } catch (err) {
      console.error("Error in payment process:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const navItems = [
    {
      icon: <CalendarDays size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Car size={20} />,
      label: "Car Rental",
      href: "/vehicle-booking",
      isActive: true,
    },
  ];

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1: // Search step
        return (
          <Card className="bg-white shadow-md border-0">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <Car className="h-5 w-5" />
                Car Rental
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="pickupDate"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Pickup Date
                    </Label>
                    <div className="flex flex-col space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="pickupTime"
                      className="text-sm font-medium mb-1.5 block"
                    >
                      Pickup Time
                    </Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                              {`${hour}:00`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="passengers"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Number of Passengers
                  </Label>
                  <Select
                    value={passengerCount.toString()}
                    onValueChange={(value) =>
                      setPassengerCount(parseInt(value))
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="pickupLocation"
                    className="text-sm font-medium mb-1.5 block flex items-center gap-2"
                  >
                    <MapPin size={16} className="text-blue-600" />
                    Pickup Location
                  </Label>
                  <div className="flex gap-2">
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
                      <Navigation className="h-4 w-4 mr-1" /> My Location
                    </Button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="dropoffLocation"
                    className="text-sm font-medium mb-1.5 block flex items-center gap-2"
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

                {error && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end">
              <Button
                onClick={calculateRoute}
                disabled={
                  !pickupLocation || !dropoffLocation || isCalculating || !date
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isCalculating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  "Search Vehicles"
                )}
              </Button>
            </CardFooter>
          </Card>
        );

      case 2: // Vehicle selection step
        return (
          <div className="space-y-6">
            <Card className="bg-white shadow-md border-0">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Select Vehicle
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setBookingStep(1)}
                  >
                    Edit Search
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{pickupLocation}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{dropoffLocation}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>
                            {date ? format(date, "EEE, d MMM yyyy") : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>
                            {passengerCount}{" "}
                            {passengerCount === 1 ? "Passenger" : "Passengers"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Distance</div>
                        <div className="font-medium">{distance} km</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-medium">{duration} min</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(vehiclePricing).map(([key, vehicle]) => {
                    const isSelected = selectedVehicleType === key;
                    const vehiclePrice = calculatePrice(
                      key,
                      distance || 0,
                      duration || 0,
                    );

                    return (
                      <div
                        key={key}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                        onClick={() => setSelectedVehicleType(key)}
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/4">
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                          <div className="md:w-2/4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {vehicle.name}
                              </h3>
                              {isSelected && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span>Up to {vehicle.capacity} passengers</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>
                                  Free cancellation up to 24h before pickup
                                </li>
                                <li>Professional driver included</li>
                                <li>Includes insurance</li>
                              </ul>
                            </div>
                          </div>
                          <div className="md:w-1/4 flex flex-col items-end justify-between">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Price</div>
                              <div className="text-xl font-semibold text-blue-600">
                                Rp {vehiclePrice.toLocaleString("id-ID")}
                              </div>
                            </div>
                            <RadioGroup
                              value={selectedVehicleType}
                              className="mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={key}
                                  id={key}
                                  checked={isSelected}
                                />
                                <Label htmlFor={key}>
                                  {isSelected ? "Selected" : "Select"}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Total Price</div>
                  <div className="text-xl font-semibold text-blue-600">
                    Rp {price?.toLocaleString("id-ID")}
                  </div>
                </div>
                <Button
                  onClick={() => setBookingStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      case 3: // Payment step
        return isBookingConfirmed ? (
          <Card className="bg-white shadow-md border-0">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Booking Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Thank You for Your Booking!
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Your car rental has been confirmed. A confirmation email has
                  been sent to your registered email address.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md mb-6">
                  <h3 className="font-semibold mb-4 text-left">
                    Booking Details
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium">
                        TRV-
                        {Math.floor(Math.random() * 1000000)
                          .toString()
                          .padStart(6, "0")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">
                        {
                          vehiclePricing[
                            selectedVehicleType as keyof typeof vehiclePricing
                          ].name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium">{pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dropoff:</span>
                      <span className="font-medium">{dropoffLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">
                        {date ? format(date, "EEE, d MMM yyyy") : ""} at {time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">{passengerCount}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Paid:</span>
                      <span className="text-blue-600">
                        Rp {(price! - discount).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/orders")}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    View My Orders
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-white shadow-md border-0">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setBookingStep(2)}
                  >
                    Back to Vehicle Selection
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Payment Method
                      </h3>
                      <Tabs
                        defaultValue="credit-card"
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-4 w-full">
                          <TabsTrigger
                            value="credit-card"
                            className="text-xs md:text-sm"
                          >
                            <CreditCard className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden md:inline">
                              Credit Card
                            </span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="bank-transfer"
                            className="text-xs md:text-sm"
                          >
                            <Building className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden md:inline">
                              Bank Transfer
                            </span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="e-wallet"
                            className="text-xs md:text-sm"
                          >
                            <Wallet className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden md:inline">E-Wallet</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="qris"
                            className="text-xs md:text-sm"
                          >
                            <QrCode className="h-4 w-4 mr-1 md:mr-2" />
                            <span className="hidden md:inline">QRIS</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="credit-card"
                          className="mt-4 space-y-4"
                        >
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  placeholder="MM/YY"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="cardholderName">
                                Cardholder Name
                              </Label>
                              <Input
                                id="cardholderName"
                                placeholder="John Doe"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="bank-transfer" className="mt-4">
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">
                                Bank Transfer Instructions
                              </h4>
                              <p className="text-sm text-gray-600 mb-4">
                                Transfer to the following account within 24
                                hours:
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Bank:</span>
                                  <span className="font-medium">
                                    Bank Central Asia (BCA)
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Account Number:
                                  </span>
                                  <span className="font-medium">
                                    1234567890
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Account Name:
                                  </span>
                                  <span className="font-medium">
                                    PT Traveloka Indonesia
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="font-medium">
                                    Rp{" "}
                                    {(price! - discount).toLocaleString(
                                      "id-ID",
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="e-wallet" className="mt-4">
                          <div className="space-y-4">
                            <RadioGroup defaultValue="gopay">
                              <div className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                                <RadioGroupItem value="gopay" id="gopay" />
                                <Label
                                  htmlFor="gopay"
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="flex justify-between items-center">
                                    <span>GoPay</span>
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/320px-Gopay_logo.svg.png"
                                      alt="GoPay"
                                      className="h-6"
                                    />
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                                <RadioGroupItem value="ovo" id="ovo" />
                                <Label
                                  htmlFor="ovo"
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="flex justify-between items-center">
                                    <span>OVO</span>
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/320px-Logo_ovo_purple.svg.png"
                                      alt="OVO"
                                      className="h-6"
                                    />
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                <RadioGroupItem value="dana" id="dana" />
                                <Label
                                  htmlFor="dana"
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="flex justify-between items-center">
                                    <span>DANA</span>
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/320px-Logo_dana_blue.svg.png"
                                      alt="DANA"
                                      className="h-6"
                                    />
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </TabsContent>

                        <TabsContent value="qris" className="mt-4">
                          <div className="flex flex-col items-center justify-center p-4">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/QRIS_logo.svg/320px-QRIS_logo.svg.png"
                              alt="QRIS Code"
                              className="h-48 mb-4"
                            />
                            <p className="text-center text-sm text-gray-600">
                              Scan this QR code with your mobile banking or
                              e-wallet app to complete the payment.
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+62 812 3456 7890"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sticky top-4">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Booking Summary
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-medium">
                            {
                              vehiclePricing[
                                selectedVehicleType as keyof typeof vehiclePricing
                              ].name
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {date ? format(date, "EEE, d MMM yyyy") : ""}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pickup:</span>
                          <span
                            className="font-medium truncate max-w-[150px]"
                            title={pickupLocation}
                          >
                            {pickupLocation}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dropoff:</span>
                          <span
                            className="font-medium truncate max-w-[150px]"
                            title={dropoffLocation}
                          >
                            {dropoffLocation}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">{distance} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{duration} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Passengers:</span>
                          <span className="font-medium">{passengerCount}</span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">
                            Rp {price?.toLocaleString("id-ID")}
                          </span>
                        </div>

                        {isPromoApplied && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>- Rp {discount.toLocaleString("id-ID")}</span>
                          </div>
                        )}

                        <div className="flex justify-between font-semibold text-base">
                          <span>Total:</span>
                          <span className="text-blue-600">
                            Rp {(price! - discount).toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="pt-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Promo code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="text-sm"
                            />
                            <Button
                              variant="outline"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 text-sm"
                              onClick={applyPromoCode}
                              disabled={!promoCode}
                            >
                              Apply
                            </Button>
                          </div>
                          {isPromoApplied && (
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Promo code applied successfully!
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Secure payment processed by Traveloka Pay</span>
                        </div>
                        <Button
                          onClick={handlePayment}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            "Complete Payment"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="Car Rental" />
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
                Car Rental Booking
              </h1>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    1
                  </div>
                  <span
                    className={`ml-2 ${bookingStep >= 1 ? "text-blue-600 font-medium" : "text-gray-600"}`}
                  >
                    Search
                  </span>
                </div>
                <div
                  className={`h-0.5 w-12 mx-2 ${bookingStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    2
                  </div>
                  <span
                    className={`ml-2 ${bookingStep >= 2 ? "text-blue-600 font-medium" : "text-gray-600"}`}
                  >
                    Select Vehicle
                  </span>
                </div>
                <div
                  className={`h-0.5 w-12 mx-2 ${bookingStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    3
                  </div>
                  <span
                    className={`ml-2 ${bookingStep >= 3 ? "text-blue-600 font-medium" : "text-gray-600"}`}
                  >
                    Payment
                  </span>
                </div>
              </div>
            </div>

            {renderBookingStep()}
          </div>
        </main>
      </div>
    </div>
  );
}
