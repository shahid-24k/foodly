"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Wallet,
  CreditCard,
  Banknote,
  Landmark,
  MapPin,
  Home,
  Briefcase,
  Building2,
  ShieldCheck,
  Store,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Tag,
  Zap,
  Headphones,
  Lock,
  Truck,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import { money, Address } from "@/lib/types";
import FoodImage from "@/components/FoodImage";
import RestaurantLogo from "@/components/RestaurantLogo";

const DEFAULT_ADDR: Address = {
  label: "Home",
  name: "Shahid Khan",
  phone: "+91 98765 43210",
  line: "12, Anna Salai, Near Bus Stand",
  city: "Krishnagiri",
  state: "Tamil Nadu",
  pin: "635001",
};

const ADDRESS_TYPES = [
  { id: "Home", label: "Home", icon: Home },
  { id: "Work", label: "Work", icon: Briefcase },
  { id: "Other", label: "Other", icon: Building2 },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", desc: "Pay using any UPI app (GPay, PhonePe, Paytm)", icon: Wallet },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major Indian banks", icon: Landmark },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, changeQty, clearCart, subtotal, deliveryFee, tax, total, count } = useCart();
  const [address, setAddress] = useState<Address>(DEFAULT_ADDR);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [payment, setPayment] = useState("upi");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const packagingFee = subtotal > 0 ? 20 : 0;
  const discountSavings = 60;
  const finalToPay = Math.max(0, subtotal + (deliveryFee || 0) + packagingFee);
  const freeDeliveryThreshold = 300;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user && !address.name) {
        setAddress((prev) => ({
          ...prev,
          name: data.user?.user_metadata?.full_name || prev.name,
        }));
      }
    });

    const savedAddr = localStorage.getItem("foodly-delivery-address");
    if (savedAddr) {
      try {
        const parsed = JSON.parse(savedAddr);
        if (parsed && parsed.line && parsed.phone) {
          setAddress(parsed);
        }
      } catch {}
    }
  }, []);

  const isAddressComplete =
    address.name.trim() !== "" &&
    address.phone.trim() !== "" &&
    address.line.trim() !== "" &&
    address.pin.trim() !== "";

  const handleSaveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAddressComplete) {
      setErrorMsg("Please fill in all required address fields.");
      return;
    }
    setErrorMsg(null);
    localStorage.setItem("foodly-delivery-address", JSON.stringify(address));
    setIsEditingAddress(false);
  };

  const placeOrder = async () => {
    setErrorMsg(null);
    if (!isAddressComplete) {
      setIsEditingAddress(true);
      setErrorMsg("Please provide a complete delivery address.");
      return;
    }

    if (!user) {
      localStorage.setItem("foodly-delivery-address", JSON.stringify(address));
      router.push("/login?next=/checkout");
      return;
    }

    setPlacing(true);
    const supabase = createClient();
    const id = "FD" + Math.floor(100000 + Math.random() * 900000);

    const { error } = await supabase.from("orders").insert([
      {
        id,
        restaurant_id: cart.restaurantId,
        restaurant_name: cart.restaurantName,
        items: Object.values(cart.items),
        subtotal,
        delivery_fee: deliveryFee,
        tax: packagingFee,
        total: finalToPay,
        address,
        payment_method: payment,
        status_index: 0,
        eta: 25,
      },
    ]);

    setPlacing(false);
    if (error) {
      setErrorMsg("Could not place order: " + error.message);
      return;
    }

    clearCart();
    router.push(`/orders/${id}`);
  };

  if (count === 0) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
          <Store size={36} />
        </div>
        <h1 className="font-bold text-2xl text-text-main dark:text-white mb-2">
          Your cart is empty
        </h1>
        <p className="text-text-muted text-sm mb-6">
          Add items from your favorite Krishnagiri restaurants to checkout.
        </p>
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-md"
        >
          Explore Restaurants <ChevronRight size={16} />
        </Link>
      </main>
    );
  }

  const selectedAddrType =
    ADDRESS_TYPES.find((t) => t.id === address.label) || ADDRESS_TYPES[0];
  const AddrIcon = selectedAddrType.icon;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/cart"
          className="w-10 h-10 rounded-full bg-surface dark:bg-[#24201D] border border-gray-200/80 dark:border-[#332E28] flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white transition-all shadow-xs"
          aria-label="Back to Cart"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-black text-2xl md:text-3xl text-text-main dark:text-white leading-tight">
            Checkout
          </h1>
          <p className="text-xs md:text-sm text-text-muted dark:text-[#8C8477] mt-0.5">
            Review your order and place it
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3 text-accent text-sm font-medium">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT / MAIN COLUMN (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. ORDERING FROM RESTAURANT BANNER */}
          <div className="bg-primary rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between text-white">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                  ORDERING FROM
                </p>
                <p className="font-black text-lg sm:text-xl leading-tight truncate">
                  {cart.restaurantName}
                </p>
              </div>
            </div>

            {cart.restaurantId && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-xs flex-shrink-0">
                <RestaurantLogo id={cart.restaurantId} name={cart.restaurantName || ""} size="md" className="w-full h-full rounded-none" />
              </div>
            )}
          </div>

          {/* 2. ORDER ITEMS REVIEW CARD */}
          <div className="bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-primary" />
                <h2 className="font-black text-base text-text-main dark:text-white">
                  Order Items ({count})
                </h2>
              </div>
              {cart.restaurantId && (
                <Link
                  href={`/restaurants/${cart.restaurantId}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus size={13} /> Add More
                </Link>
              )}
            </div>

            <div className="space-y-3">
              {Object.values(cart.items).map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50/70 dark:bg-[#1A202C]/60 rounded-2xl p-3.5 border border-gray-100 dark:border-[#332E28] flex items-center gap-3.5"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1A202C] flex-shrink-0 relative">
                    <FoodImage
                      src={item.image_url}
                      id={item.id}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-text-main dark:text-white leading-snug truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {money(item.price)} each
                    </p>
                    <div className="mt-1">
                      {item.is_veg ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          Veg
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                          Non-Veg
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-[#24201D] p-1 rounded-xl border border-gray-200 dark:border-[#332E28] flex-shrink-0">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-6 h-6 rounded-lg text-text-main dark:text-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-text-main dark:text-white tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <span className="font-bold text-sm text-primary dark:text-secondary tabular-nums w-16 text-right flex-shrink-0">
                    {money(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery note */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#332E28]">
              <input
                placeholder="Add delivery note (e.g. Leave at door, avoid ringing bell)..."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full text-xs border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white placeholder-text-muted"
              />
            </div>
          </div>

          {/* 3. ADD MORE / SAVINGS PROMO CARD */}
          <div className="bg-[#F6F2FF] dark:bg-[#201A33] border border-primary/15 dark:border-primary/30 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                <Truck size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm text-text-main dark:text-white">
                  Add more items, save more!
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  {deliveryFee === 0
                    ? "🎉 You've unlocked FREE delivery!"
                    : `You're ${money(amountToFreeDelivery)} away from FREE delivery`}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-muted">₹0</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted">₹{freeDeliveryThreshold}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1A202C] px-3.5 py-2 rounded-xl border border-primary/10 shadow-xs flex-shrink-0">
              <Truck size={15} className="text-secondary" />
              <span className="text-xs font-black text-primary uppercase tracking-wide">
                FREE DELIVERY
              </span>
            </div>
          </div>

          {/* 4. DELIVERY ADDRESS CARD */}
          <div className="bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <h2 className="font-black text-base text-text-main dark:text-white">
                  Delivery Address
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAddress((v) => !v)}
                className="text-xs font-bold text-primary hover:underline bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1"
              >
                <Edit3 size={12} /> {isEditingAddress ? "Cancel" : "Change"}
              </button>
            </div>

            {!isEditingAddress ? (
              <div className="bg-gray-50/80 dark:bg-[#1A202C]/60 border border-gray-100 dark:border-[#332E28] rounded-2xl p-4.5 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white dark:bg-[#24201D] text-primary shadow-xs flex-shrink-0 mt-0.5">
                  <AddrIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-main dark:text-white">
                      {address.name || "Customer"}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {address.label} (Default)
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {address.line}, {address.city}, {address.state} — {address.pin}
                  </p>
                  <p className="text-xs font-semibold text-text-main dark:text-gray-300 mt-1">
                    {address.phone}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs font-bold text-primary hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    + Add New Address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="flex gap-2">
                  {ADDRESS_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAddress({ ...address, label: t.id })}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        address.label === t.id
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-50 dark:bg-[#1A202C] text-text-muted border border-gray-100 dark:border-[#332E28]"
                      }`}
                    >
                      <t.icon size={13} />
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Full Name *"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full text-sm border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                  />
                  <input
                    required
                    placeholder="Phone Number *"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full text-sm border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                  />
                </div>

                <input
                  required
                  placeholder="Street / Locality Address *"
                  value={address.line}
                  onChange={(e) => setAddress({ ...address, line: e.target.value })}
                  className="w-full text-sm border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                />

                <div className="grid grid-cols-3 gap-3">
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full text-sm border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                  />
                  <input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full text-sm border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                  />
                  <input
                    required
                    placeholder="PIN Code *"
                    value={address.pin}
                    onChange={(e) => setAddress({ ...address, pin: e.target.value })}
                    className="w-full text-sm border border-gray-200 dark:border-[#332E28] rounded-xl px-3.5 py-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Save &amp; Deliver Here
                </button>
              </form>
            )}
          </div>

          {/* 5. PAYMENT METHOD CARD */}
          <div className="bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Wallet size={16} />
                </div>
                <h2 className="font-black text-base text-text-main dark:text-white">
                  Payment Methods
                </h2>
              </div>
              <span className="text-xs font-bold text-primary">Select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((p) => {
                const isSelected = payment === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                        : "border-gray-100 dark:border-[#332E28] bg-surface dark:bg-[#1A202C] hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        isSelected ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-text-main dark:text-white block leading-tight">
                        {p.label}
                      </span>
                      <span className="text-[11px] text-text-muted block mt-1 line-clamp-1">
                        {p.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-surface dark:bg-[#24201D] p-3.5 rounded-2xl border border-gray-100 dark:border-[#332E28] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-text-main dark:text-white">Fast Delivery</p>
                <p className="text-[10px] text-text-muted">On time, every time</p>
              </div>
            </div>

            <div className="bg-surface dark:bg-[#24201D] p-3.5 rounded-2xl border border-gray-100 dark:border-[#332E28] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Tag size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-text-main dark:text-white">Best Offers</p>
                <p className="text-[10px] text-text-muted">Great deals &amp; discounts</p>
              </div>
            </div>

            <div className="bg-surface dark:bg-[#24201D] p-3.5 rounded-2xl border border-gray-100 dark:border-[#332E28] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-text-main dark:text-white">Secure Payments</p>
                <p className="text-[10px] text-text-muted">100% safe &amp; secure</p>
              </div>
            </div>

            <div className="bg-surface dark:bg-[#24201D] p-3.5 rounded-2xl border border-gray-100 dark:border-[#332E28] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Headphones size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-text-main dark:text-white">24/7 Support</p>
                <p className="text-[10px] text-text-muted">We're here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT / SIDEBAR (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {/* Order Summary Card */}
          <div className="bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-6 shadow-sm">
            <h2 className="font-black text-lg text-text-main dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm text-text-muted pb-4">
              <div className="flex justify-between">
                <span>Items ({count})</span>
                <span className="text-text-main dark:text-white font-semibold">
                  {money(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Delivery Fee <Info size={13} className="text-text-muted cursor-help" />
                </span>
                <span className={deliveryFee === 0 ? "text-secondary font-bold" : "text-text-main dark:text-white font-semibold"}>
                  {deliveryFee === 0 ? "FREE" : money(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Packaging Fee</span>
                <span className="text-text-main dark:text-white font-semibold">
                  {money(packagingFee)}
                </span>
              </div>
            </div>

            {/* To Pay Section */}
            <div className="pt-4 border-t border-gray-100 dark:border-[#332E28] flex justify-between items-baseline mb-4">
              <span className="font-bold text-base text-text-main dark:text-white">
                To Pay
              </span>
              <span className="font-black text-2xl text-primary">
                {money(finalToPay)}
              </span>
            </div>

            {/* Savings banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-5">
              <Tag size={15} />
              <span>You're saving ₹{discountSavings} on this order</span>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={placeOrder}
              disabled={placing}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl text-base transition-all shadow-[0_8px_30px_rgb(106,56,194,0.35)] hover:shadow-[0_12px_40px_rgb(106,56,194,0.45)] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order…</span>
                </>
              ) : (
                <span>Place Order · {money(finalToPay)}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted mt-3">
              <Lock size={13} />
              <span>Secure payments. Easy returns.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
