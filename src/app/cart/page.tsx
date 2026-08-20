"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Truck,
  ShieldCheck,
  Tag,
  Headphones,
  Zap,
  Home,
  Briefcase,
  Building2,
  Wallet,
  CreditCard,
  Landmark,
  Banknote,
  Lock,
  Edit3,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { money, Address } from "@/lib/types";
import FoodImage from "@/components/FoodImage";
import RestaurantLogo from "@/components/RestaurantLogo";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_ADDRESS: Address = {
  label: "Home",
  name: "Shahid Khan",
  phone: "+91 98765 43210",
  line: "12, Anna Salai, Near Bus Stand",
  city: "Krishnagiri",
  state: "Tamil Nadu",
  pin: "635001",
};

const ADDRESS_TYPES = [
  { id: "Home", icon: Home },
  { id: "Work", icon: Briefcase },
  { id: "Other", icon: Building2 },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", desc: "Pay using any UPI app", icon: Wallet },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Landmark },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: Banknote },
];

export default function CartPage() {
  const router = useRouter();
  const { cart, changeQty, clearCart, subtotal, deliveryFee, tax, total, count } = useCart();
  const [address, setAddress] = useState<Address>(DEFAULT_ADDRESS);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [payment, setPayment] = useState("upi");
  const [user, setUser] = useState<any>(null);
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const freeDeliveryThreshold = 300;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const packagingFee = subtotal > 0 ? 20 : 0;
  const discountSavings = 60;
  const finalToPay = Math.max(0, subtotal + (deliveryFee || 0) + packagingFee);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const savedAddr = localStorage.getItem("foodly-delivery-address");
    if (savedAddr) {
      try {
        const parsed = JSON.parse(savedAddr);
        if (parsed && parsed.line) setAddress(parsed);
      } catch {}
    }
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("foodly-delivery-address", JSON.stringify(address));
    setIsEditingAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      localStorage.setItem("foodly-delivery-address", JSON.stringify(address));
      router.push("/login?next=/checkout");
      return;
    }

    setPlacing(true);
    setErrorMsg(null);
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={cart.restaurantId ? `/restaurants/${cart.restaurantId}` : "/restaurants"}
          className="w-10 h-10 rounded-full bg-surface dark:bg-[#24201D] border border-gray-200/80 dark:border-[#332E28] flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white transition-all shadow-xs"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-black text-2xl md:text-3xl text-text-main dark:text-white leading-tight">
            Your Cart
          </h1>
          <p className="text-xs md:text-sm text-text-muted dark:text-[#8C8477] mt-0.5">
            Review your items and proceed to checkout
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3 text-accent text-sm font-medium">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {count === 0 ? (
        /* Empty State */
        <div className="text-center py-24 bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] shadow-sm p-8 max-w-xl mx-auto">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-text-main dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-text-muted text-sm mb-6">Explore Krishnagiri's best restaurants and add dishes.</p>
          <Link
            href="/restaurants"
            className="inline-block bg-primary text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-primary-dark transition-all shadow-md"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        /* ================= 2-COLUMN MAIN CONTENT ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT / MAIN ITEMS (7 cols) ================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Ordering From Banner */}
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

            {/* Cart Items List */}
            <div className="space-y-3">
              {Object.values(cart.items).map((item) => (
                <div
                  key={item.id}
                  className="bg-surface dark:bg-[#24201D] rounded-2xl p-3.5 sm:p-4 border border-gray-100 dark:border-[#332E28] shadow-xs flex items-center gap-3.5 sm:gap-4 transition-all hover:border-primary/20"
                >
                  {/* Small Food Thumbnail (~64px-72px) */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1A202C] flex-shrink-0 relative">
                    <FoodImage
                      src={item.image_url}
                      id={item.id}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title, Unit Price, Veg badge */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-text-main dark:text-white leading-snug truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {money(item.price)} each
                    </p>
                    <div className="mt-1">
                      {item.is_veg ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          Veg
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                          Non-Veg
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Modifier: (-) 1 (+) */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A202C] p-1 rounded-xl flex-shrink-0">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-[#24201D] text-text-main dark:text-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold w-6 text-center text-text-main dark:text-white tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Total for Item */}
                  <div className="w-16 sm:w-20 text-right flex-shrink-0">
                    <span className="font-bold text-sm sm:text-base text-primary dark:text-secondary tabular-nums">
                      {money(item.price * item.qty)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => changeQty(item.id, -999)}
                    className="p-2 rounded-xl text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear cart action */}
            <div className="flex justify-end pt-1">
              <button
                onClick={clearCart}
                className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
              >
                <Trash2 size={13} /> Clear Cart
              </button>
            </div>

            {/* Add More / Savings Promotional Card */}
            <div className="bg-[#F6F2FF] dark:bg-[#201A33] border border-primary/15 dark:border-primary/30 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Delivery Scooter Illustration / Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <Truck size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm sm:text-base text-text-main dark:text-white">
                    Add more items, save more!
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    {deliveryFee === 0
                      ? "🎉 You've unlocked FREE delivery on this order!"
                      : `You're ${money(amountToFreeDelivery)} away from FREE delivery`}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2.5 flex items-center gap-2">
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

              {/* Free delivery badge */}
              <div className="flex items-center gap-2 bg-white dark:bg-[#1A202C] px-3.5 py-2 rounded-xl border border-primary/10 shadow-xs flex-shrink-0">
                <Truck size={16} className="text-secondary" />
                <span className="text-xs font-black text-primary uppercase tracking-wide">
                  FREE DELIVERY
                </span>
              </div>
            </div>

            {/* Service Benefit Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
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
            {/* 1. Order Summary Card */}
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

              {/* Place Order / Proceed to Checkout CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl text-base transition-all shadow-[0_8px_30px_rgb(106,56,194,0.35)] hover:shadow-[0_12px_40px_rgb(106,56,194,0.45)] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {placing ? "Placing order…" : "Proceed to Checkout"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted mt-3">
                <Lock size={13} />
                <span>Secure payments. Easy returns.</span>
              </div>
            </div>

            {/* 2. Delivery Address Card */}
            <div className="bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-text-main dark:text-white">
                  Delivery Address
                </h3>
                <button
                  onClick={() => setIsEditingAddress((v) => !v)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {isEditingAddress ? "Cancel" : "Change"}
                </button>
              </div>

              {!isEditingAddress ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Home size={13} />
                    </div>
                    <span className="font-bold text-sm text-text-main dark:text-white">
                      {address.label}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed pl-8">
                    {address.line}, {address.city}, {address.state} - {address.pin}
                  </p>
                  <p className="text-xs text-text-muted pl-8 mt-0.5">
                    {address.phone}
                  </p>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs font-bold text-primary hover:underline mt-2.5 pl-8 flex items-center gap-1"
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveAddress} className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    {ADDRESS_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAddress({ ...address, label: t.id })}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          address.label === t.id
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-[#1A202C] text-text-muted"
                        }`}
                      >
                        {t.id}
                      </button>
                    ))}
                  </div>
                  <input
                    required
                    placeholder="Full Address"
                    value={address.line}
                    onChange={(e) => setAddress({ ...address, line: e.target.value })}
                    className="w-full text-xs border border-gray-200 dark:border-[#332E28] rounded-xl p-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      placeholder="Phone"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full text-xs border border-gray-200 dark:border-[#332E28] rounded-xl p-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                    />
                    <input
                      required
                      placeholder="PIN Code"
                      value={address.pin}
                      onChange={(e) => setAddress({ ...address, pin: e.target.value })}
                      className="w-full text-xs border border-gray-200 dark:border-[#332E28] rounded-xl p-2.5 outline-none focus:border-primary bg-background dark:bg-[#1A202C] text-text-main dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-2 rounded-xl text-xs"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>

            {/* 3. Payment Methods Card */}
            <div className="bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-text-main dark:text-white">
                  Payment Methods
                </h3>
                <span className="text-xs font-bold text-primary">Select</span>
              </div>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((p) => {
                  const isSelected = payment === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPayment(p.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                          : "border-gray-100 dark:border-[#332E28] bg-surface dark:bg-[#1A202C] hover:border-primary/30"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-primary" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#24201D] text-text-main dark:text-white flex items-center justify-center flex-shrink-0">
                        <p.icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-text-main dark:text-white block leading-tight">
                          {p.label}
                        </span>
                        <span className="text-[10px] text-text-muted block truncate">
                          {p.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
