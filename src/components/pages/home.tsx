import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-black">
      {/* Modern navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">
              Arisia
            </Link>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              TKI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600 hover:bg-blue-50"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer ring-2 ring-blue-100 hover:ring-blue-300 transition-all">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600 hover:bg-blue-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-6 shadow-md hover:shadow-lg transition-all">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=1200&q=80')] bg-cover opacity-10"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-block mb-6 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
              Aplikasi Khusus untuk Tenaga Kerja Indonesia
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Arisia
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-8 max-w-3xl mx-auto">
              Solusi terbaik untuk perjalanan TKI Indonesia. Pesan tiket
              pesawat, kereta, atau kendaraan dengan mudah.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button
                onClick={() => navigate("/signup")}
                className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                Mulai Sekarang
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-50 text-base px-8 py-6 w-full sm:w-auto"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"
                alt="TKI Travel"
                className="rounded-xl w-full h-64 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-block mb-4 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
              Fitur Unggulan
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
              Layanan Lengkap untuk TKI
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-12 max-w-3xl mx-auto">
              Mau pulang kemana, mau apa, mau pesan tiket pesawat, tiket kereta
              atau kendaraan. Kami bantu sediakan sampai beres.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-blue-200"></div>
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-blue-200 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-600"
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
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">
                  Pemesanan Cepat
                </h4>
                <p className="text-gray-600 mb-4">
                  Proses pemesanan tiket yang cepat dan mudah untuk semua TKI
                  yang ingin bepergian.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 font-medium flex items-center hover:text-blue-700"
                >
                  Pelajari <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-indigo-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-100 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-indigo-200"></div>
                <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-indigo-200 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">
                  Keamanan Terjamin
                </h4>
                <p className="text-gray-600 mb-4">
                  Keamanan data dan transaksi menjadi prioritas utama untuk
                  melindungi pengguna kami.
                </p>
                <Link
                  to="/"
                  className="text-indigo-600 font-medium flex items-center hover:text-indigo-700"
                >
                  Pelajari <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-green-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-green-100 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-green-200"></div>
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-green-200 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">
                  Pembayaran Fleksibel
                </h4>
                <p className="text-gray-600 mb-4">
                  Berbagai metode pembayaran yang memudahkan TKI dalam melakukan
                  transaksi.
                </p>
                <Link
                  to="/"
                  className="text-green-600 font-medium flex items-center hover:text-green-700"
                >
                  Pelajari <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                Layanan Kami
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
                Solusi Perjalanan Lengkap
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Kami menyediakan berbagai layanan untuk memudahkan perjalanan
                Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-blue-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-white opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 18l14-9-7-4-7 4v9zm0 0l7 4 7-4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tiket Pesawat
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Pesan tiket pesawat dengan harga terbaik untuk perjalanan
                    Anda
                  </p>
                  <Button
                    onClick={() => navigate("/new-order?type=flight")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Pesan Sekarang
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-green-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-white opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tiket Kereta
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Pesan tiket kereta api dengan mudah dan cepat
                  </p>
                  <Button
                    onClick={() => navigate("/new-order?type=train")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Pesan Sekarang
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-orange-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-white opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Sewa Kendaraan
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sewa kendaraan untuk perjalanan yang lebih nyaman
                  </p>
                  <Button
                    onClick={() => navigate("/new-order?type=vehicle")}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Pesan Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                Testimoni
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
                Apa Kata Mereka
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pengalaman TKI yang telah menggunakan layanan kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Susi"
                      alt="Susi"
                    />
                    <AvatarFallback>SU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900">Susi Susanti</h4>
                    <p className="text-sm text-gray-600">TKI di Malaysia</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Aplikasi ini sangat membantu saya untuk memesan tiket pulang
                  ke Indonesia. Prosesnya mudah dan cepat!"
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
                      alt="Budi"
                    />
                    <AvatarFallback>BU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900">Budi Santoso</h4>
                    <p className="text-sm text-gray-600">TKI di Singapura</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Saya bisa dengan mudah memesan tiket kereta untuk perjalanan
                  pulang. Harga yang ditawarkan juga sangat bersaing."
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi"
                      alt="Dewi"
                    />
                    <AvatarFallback>DE</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900">Dewi Lestari</h4>
                    <p className="text-sm text-gray-600">TKI di Hong Kong</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Layanan customer service sangat responsif. Mereka membantu
                  saya ketika ada masalah dengan pemesanan tiket."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Siap Untuk Memulai Perjalanan Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan TKI lainnya yang telah menggunakan
              layanan kami untuk perjalanan mereka
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="rounded-full bg-white text-blue-600 hover:bg-blue-50 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-blue-700 text-base px-8 py-6 w-full sm:w-auto"
                >
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700">
            <div>
              <h4 className="font-bold text-lg mb-4 text-blue-400">Arisia</h4>
              <p className="text-gray-400 mb-4">
                Aplikasi perjalanan terbaik untuk TKI Indonesia
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Layanan</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Tiket Pesawat
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Tiket Kereta
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Sewa Kendaraan
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Paket Perjalanan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Berita
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Bantuan</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Pusat Bantuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-gray-400">
            <p>© 2024 Arisia. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
