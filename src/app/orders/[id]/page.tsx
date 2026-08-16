"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Circle, Navigation, MapPin, Store, Bike, Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Order, STATUS_STEPS, money } from "@/lib/types";

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [realtimeActive, setRealtimeActive] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const load = () => supabase.from("orders").select("*").eq("id", id).single().then(({ data }) => setOrder(data));
    load();

    // Set up Supabase Realtime subscription for instant live updates when status changes
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` },
        (payload) => {
          setOrder(payload.new as Order);
          setRealtimeActive(true);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeActive(true);
      });

    // Fallback client-side status auto-advance timer for viva/demo
    const interval = setInterval(async () => {
      const { data } = await supabase.from("orders").select("status_index").eq("id", id).single();
      if (!data || data.status_index >= STATUS_STEPS.length - 1) return;
      const next = data.status_index + 1;
      await supabase.from("orders").update({ status_index: next }).eq("id", id);
      load();
    }, 4500);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [id]);

  if (!order) return <div className="max-w-lg mx-auto px-4 py-20 text-center text-[#9A9488] dark:text-[#8C8477]">Loading…</div>;

  const isOutForDelivery = order.status_index >= 4;
  const isDelivered = order.status_index >= 5;
  const progressPercent = Math.min(100, Math.max(10, (order.status_index / (STATUS_STEPS.length - 1)) * 100));

  return (
    <main className="max-w-lg mx-auto px-4 md:px-8 py-6 pb-24">
      <button onClick={() => router.push("/orders")} className="flex items-center gap-1 text-sm text-[#9A9488] dark:text-[#8C8477] mb-4 hover:text-charcoal dark:hover:text-white">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-black text-xl text-charcoal dark:text-white">Order #{order.id}</h1>
        {realtimeActive && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-leaf/15 text-leaf">
            <Radio size={10} className="animate-pulse" /> LIVE REALTIME
          </span>
        )}
      </div>
      <p className="text-sm text-[#9A9488] dark:text-[#8C8477] mb-6">{order.restaurant_name} &middot; ETA {order.eta} min</p>

      {/* Live Route Map Simulation */}
      <div className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-4 mb-5 overflow-hidden relative shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-charcoal dark:text-white flex items-center gap-1.5">
            <Navigation size={14} className="text-mango" /> Live Delivery Route
          </span>
          <span className="text-[10px] font-bold text-[#9A9488] uppercase tracking-wide">
            Krishnagiri Central
          </span>
        </div>

        {/* Animated Map Canvas SVG */}
        <div className="h-36 rounded-xl bg-[#F7F3EC] dark:bg-[#1C1A18] relative overflow-hidden border border-line dark:border-[#332E28] p-3 flex flex-col justify-between">
          {/* Map Grid Roads background graphic */}
          <svg className="absolute inset-0 w-full h-full opacity-20 stroke-charcoal dark:stroke-white" fill="none" strokeWidth="1">
            <path d="M 0 30 Q 100 40 200 20 T 400 60" />
            <path d="M 50 0 Q 80 80 120 150" />
            <path d="M 220 0 Q 250 70 300 150" />
            <path d="M 0 110 Q 150 100 350 120" />
          </svg>

          {/* Progress route line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-line dark:bg-[#332E28] -translate-y-1/2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mango to-leaf transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Pins */}
          <div className="relative z-10 flex justify-between items-center h-full px-2">
            {/* Restaurant Pin */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#24201D] border-2 border-mango flex items-center justify-center shadow">
                <Store size={14} className="text-mango" />
              </div>
              <span className="text-[9px] font-bold text-charcoal dark:text-white mt-1 bg-white/80 dark:bg-black/60 px-1.5 rounded">
                {order.restaurant_name.split(" ")[0]}
              </span>
            </div>

            {/* Moving Delivery Partner Bike */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
              style={{ left: `calc(${Math.min(85, Math.max(12, progressPercent))}% - 16px)` }}
            >
              <div className="relative">
                <div className={`w-9 h-9 rounded-full ${isDelivered ? "bg-leaf" : "bg-mango"} text-white flex items-center justify-center shadow-lg animate-bounce`}>
                  <Bike size={18} />
                </div>
                {!isDelivered && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-leaf rounded-full border-2 border-white animate-ping" />
                )}
              </div>
            </div>

            {/* Destination Home Pin */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full bg-white dark:bg-[#24201D] border-2 ${isDelivered ? "border-leaf" : "border-line dark:border-[#332E28]"} flex items-center justify-center shadow`}>
                <MapPin size={14} className={isDelivered ? "text-leaf" : "text-[#9A9488]"} />
              </div>
              <span className="text-[9px] font-bold text-charcoal dark:text-white mt-1 bg-white/80 dark:bg-black/60 px-1.5 rounded">
                Your Home
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#9A9488] dark:text-[#8C8477]">
            {isDelivered ? "Delivered to your doorstep" : isOutForDelivery ? "Delivery partner is on the way!" : "Kitchen preparing your food"}
          </span>
          <span className="font-bold text-mango">
            {isDelivered ? "Completed" : `${order.eta} min left`}
          </span>
        </div>
      </div>

      {/* Progress Status Steps */}
      <div className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-5 mb-5">
        {STATUS_STEPS.map((s, i) => {
          const done = i <= order.status_index;
          return (
            <div key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${done ? "bg-leaf text-white" : "bg-chip dark:bg-[#1C1A18] text-[#9A9488]"}`}>
                  {done ? <Check size={14} /> : <Circle size={8} className="fill-current" />}
                </div>
                {i < STATUS_STEPS.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] transition-colors ${i < order.status_index ? "bg-leaf" : "bg-chip dark:bg-[#1C1A18]"}`} />}
              </div>
              <div className="pb-6">
                <p className={`text-sm font-bold ${done ? "text-charcoal dark:text-white" : "text-[#9A9488] dark:text-[#8C8477]"}`}>{s}</p>
                {i === order.status_index && i < STATUS_STEPS.length - 1 && <p className="text-xs text-mango mt-0.5">In progress…</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-4 space-y-2 text-sm">
        <p className="text-xs font-bold text-[#9A9488] dark:text-[#8C8477]">ITEMS</p>
        {order.items.map((i) => <div key={i.id} className="flex justify-between text-charcoal dark:text-white"><span>{i.qty} &times; {i.name}</span><span>{money(i.qty * i.price)}</span></div>)}
        <div className="border-t border-dashed border-line dark:border-[#332E28] pt-2 flex justify-between font-bold text-charcoal dark:text-white"><span>Total</span><span>{money(order.total)}</span></div>
        {order.address && <p className="text-xs text-[#9A9488] dark:text-[#8C8477] pt-2">{order.address.line}, {order.address.city} &middot; {order.payment_method.toUpperCase()}</p>}
      </div>
    </main>
  );
}
