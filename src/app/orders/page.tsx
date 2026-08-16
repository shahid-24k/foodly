"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Order, STATUS_STEPS, money } from "@/lib/types";
import RestaurantLogo from "@/components/RestaurantLogo";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }
      const { data: rows } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders(rows || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return orders;
    const qq = q.toLowerCase();
    return orders.filter((o) => o.restaurant_name.toLowerCase().includes(qq) || o.id.toLowerCase().includes(qq));
  }, [orders, q]);

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-6 pb-24">
      <h1 className="font-display font-black text-2xl text-charcoal dark:text-white mb-5">Your orders</h1>
      {loading ? (
        <p className="text-sm text-[#9A9488] dark:text-[#8C8477]">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-6">
          <FileText size={36} className="text-line dark:text-[#332E28] mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-bold text-charcoal dark:text-white">Your food journey starts here.</p>
          <Link href="/restaurants" className="inline-block mt-5 bg-mango text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-maroon transition-colors">
            Order now
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 border border-line dark:border-[#332E28] rounded-xl px-3 py-2.5 bg-white dark:bg-[#24201D]">
            <Search size={15} className="text-[#9A9488]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by restaurant or order ID"
              className="flex-1 text-sm outline-none bg-transparent text-charcoal dark:text-white placeholder-[#9A9488]"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-[#9A9488] dark:text-[#8C8477] text-center py-10">No orders match &ldquo;{q}&rdquo;.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((o) => (
                <div key={o.id} className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3">
                      <RestaurantLogo id={o.restaurant_id} name={o.restaurant_name} size="sm" />
                      <div>
                        <p className="font-bold text-sm text-charcoal dark:text-white">{o.restaurant_name}</p>
                        <p className="text-xs text-[#9A9488] dark:text-[#8C8477] mt-0.5">#{o.id} &middot; {o.items.length} items &middot; {money(o.total)}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${o.status_index >= STATUS_STEPS.length - 1 ? "bg-leaf/15 text-leaf" : "bg-mango/15 text-maroon dark:text-mango"}`}>
                      {STATUS_STEPS[o.status_index]}
                    </span>
                  </div>
                  <Link href={`/orders/${o.id}`} className="block mt-3 border border-line dark:border-[#332E28] text-charcoal dark:text-white text-center font-bold text-xs py-2 rounded-xl hover:bg-chip dark:hover:bg-[#1C1A18] transition-colors">
                    Track &amp; View Order &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
