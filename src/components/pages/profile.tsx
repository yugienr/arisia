import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, Package, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { userData, updateProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setFullName(userData.full_name || "");
      setPhoneNumber(userData.phone_number || "");
      setEmail(userData.email || "");
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        full_name: fullName,
        phone_number: phoneNumber,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { icon: <CalendarDays size={20} />, label: "Dashboard" },
    { icon: <User size={20} />, label: "Profile", isActive: true },
    { icon: <Package size={20} />, label: "Orders" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar items={navItems} activeItem="Profile" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Update your personal information
              </p>
            </div>

            <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="h-12 rounded-lg border-gray-300 bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+62 xxx xxxx xxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-sm font-medium text-gray-700"
                    >
                      Account Type
                    </Label>
                    <Input
                      id="role"
                      value={
                        userData?.role
                          ? userData.role.charAt(0).toUpperCase() +
                            userData.role.slice(1)
                          : "Customer"
                      }
                      disabled
                      className="h-12 rounded-lg border-gray-300 bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  To change your password, please use the reset password
                  feature.
                </p>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Reset Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
