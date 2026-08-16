"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2, Wallet, CreditCard, Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import { money, Address } from "@/lib/types";

const EMPTY_ADDR: Address = { label: "Home", name: "", phone: "", line: "", city: "Krishnagiri", state: "Tamil Nadu", pin: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "confirm">("details");
  const [address, setAddress] = useState<Address>(EMPTY_ADDR);
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const steps = [{ id: "details", label: "Address & payment" }, { id: "confirm", label: "Confirm" }];
  const stepIdx = steps.findIndex((s) => s.id === step);

  const placeOrder = async () => {
    if (!user) { router.push("/login?next=/checkout"); return; }
    setPlacing(true);
    const supabase = createClient();
    const id = "FD" + Math.floor(100000 + Math.random() * 900000);
    const { error } = await supabase.from("orders").insert([{
      id, restaurant_id: cart.restaurantId, restaurant_name: cart.restaurantName,
      items: Object.values(cart.items), subtotal, delivery_fee: deliveryFee, tax, total,
      address, payment_method: payment, status_index: 0, eta: 32,
    }]);
    setPlacing(false);
    if (error) { alert("Could not place order: " + error.message); return; }
    clearCart();
    router.push(`/orders/${id}`);
  };

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-6 pb-32">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[#9A9488] mb-4 hover:text-charcoal"><ArrowLeft size={15} /> Back</button>
      <div className="flex items-center gap-2 mb-7">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i <= stepIdx ? "bg-mango text-white" : "bg-chip text-[#9A9488]"}`}>{i < stepIdx ? <Check size={14} /> : i + 1}</div>
            <span className={`text-xs font-bold ${i <= stepIdx ? "text-charcoal" : "text-[#9A9488]"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < stepIdx ? "bg-mango" : "bg-chip"}`} />}
          </div>
        ))}
      </div>

      {step === "details" && (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold text-[#9A9488] mb-2 uppercase tracking-wide">Delivery address</p>
            <div className="space-y-3">
              {["label", "name", "phone", "line", "city", "state", "pin"].map((f) => (
                <input key={f} placeholder={f[0].toUpperCase() + f.slice(1)} value={(address as any)[f]}
                  onChange={(e) => setAddress({ ...address, [f]: e.target.value })}
                  className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#9A9488] mb-2 uppercase tracking-wide">Payment method</p>
            <div className="space-y-2">
              {[
                { id: "upi", label: "UPI", icon: Wallet },
                { id: "card", label: "Card", icon: CreditCard },
                { id: "cod", label: "Cash on Delivery", icon: Banknote },
              ].map((p) => (
                <button key={p.id} onClick={() => setPayment(p.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 ${payment === p.id ? "border-mango bg-[#FBEADD]" : "border-line bg-white"}`}>
                  <p.icon size={18} className="text-mango" />
                  <span className="flex-1 text-left font-bold text-sm text-charcoal">{p.label}</span>
                  {payment === p.id && <CheckCircle2 size={16} className="text-mango" />}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep("confirm")} disabled={!address.line || !address.phone}
            className="w-full bg-mango disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl">Review order</button>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-line p-4">
            <p className="text-xs font-bold text-[#9A9488] mb-2">DELIVERING TO</p>
            <p className="text-sm text-charcoal">{address.line}, {address.city}</p>
            <p className="text-xs text-[#9A9488] mt-1 uppercase">{payment}</p>
          </div>
          <div className="bg-white rounded-2xl border border-line p-4">
            <p className="text-xs font-bold text-[#9A9488] mb-2">{Object.values(cart.items).length} ITEMS</p>
            <div className="flex justify-between font-bold text-charcoal"><span>Total</span><span>{money(total)}</span></div>
          </div>
          <button onClick={placeOrder} disabled={placing} className="w-full bg-charcoal disabled:opacity-60 text-white font-bold py-4 rounded-2xl">
            {placing ? "Placing order…" : `Place order · ${money(total)}`}
          </button>
        </div>
      )}
    </main>
  );
}
