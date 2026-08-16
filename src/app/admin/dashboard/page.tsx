"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Store, Package, DollarSign, ShieldCheck, Check, X, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Restaurant, Order, money } from "@/lib/types";

export default function AdminDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [claimRequests, setClaimRequests] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [ready, setReady] = useState(false);

  const loadData = async () => {
    const supabase = createClient();
    const [{ data: r }, { data: o }, { count }] = await Promise.all([
      supabase.from("restaurants").select("*"),
      supabase.from("orders").select("*"),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);
    setRestaurants(r || []);
    setOrders(o || []);
    setUserCount(count || 0);

    try {
      const { data: claims } = await supabase
        .from("claim_requests")
        .select("*, profile:profiles(email, full_name), restaurant:restaurants(name)")
        .order("created_at", { ascending: false });
      setClaimRequests(claims || []);
    } catch {
      setClaimRequests([]);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      await loadData();
      setReady(true);
    });
  }, [router]);

  const handleApprove = async (claim: any) => {
    const supabase = createClient();
    // 1. Update claim_requests status to approved
    const { error: claimErr } = await supabase
      .from("claim_requests")
      .update({ status: "approved" })
      .eq("id", claim.id);
    if (claimErr) { alert("Error approving claim: " + claimErr.message); return; }

    // 2. Link restaurant to profile (admin caller passes prevent_privilege_escalation trigger!)
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ restaurant_id: claim.restaurant_id })
      .eq("id", claim.user_id);
    if (profileErr) { alert("Claim updated, but profile link failed: " + profileErr.message); }

    await loadData();
  };

  const handleReject = async (claimId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("claim_requests")
      .update({ status: "rejected" })
      .eq("id", claimId);
    if (error) { alert("Error rejecting claim: " + error.message); return; }
    await loadData();
  };

  if (!ready) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-[#9A9488]">Loading…</div>;

  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const pendingClaims = claimRequests.filter((c) => c.status === "pending");

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 pb-16">
      <h1 className="font-display font-black text-2xl text-charcoal mb-1">Admin dashboard</h1>
      <p className="text-sm text-[#9A9488] mb-6">Platform overview</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total users", value: String(userCount), icon: Users },
          { label: "Restaurants", value: String(restaurants.length), icon: Store },
          { label: "Total orders", value: String(orders.length), icon: Package },
          { label: "Revenue", value: money(revenue), icon: DollarSign },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-line p-4">
            <c.icon size={18} className="text-mango" />
            <p className="text-xl font-black text-charcoal mt-2">{c.value}</p>
            <p className="text-xs text-[#9A9488]">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Claim Requests Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg text-charcoal">Restaurant Claim Requests</h2>
          {pendingClaims.length > 0 && (
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-mango text-white">
              {pendingClaims.length} pending
            </span>
          )}
        </div>
        {claimRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line p-6 text-center text-xs text-[#9A9488]">
            No claim requests submitted yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-line divide-y divide-line">
            {claimRequests.map((c) => (
              <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal">
                      {c.profile?.full_name || c.profile?.email || c.user_id}
                    </span>
                    <span className="text-xs text-[#9A9488]">wants to claim</span>
                    <span className="font-bold text-sm text-mango">
                      {c.restaurant?.name || c.restaurant_id}
                    </span>
                  </div>
                  {c.message && (
                    <p className="text-xs text-[#55504A] mt-1 bg-chip p-2 rounded-lg italic">
                      &ldquo;{c.message}&rdquo;
                    </p>
                  )}
                  <p className="text-[10px] text-[#9A9488] mt-1">
                    Submitted: {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  {c.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(c)}
                        className="flex items-center gap-1 text-xs font-bold bg-leaf text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(c.id)}
                        className="flex items-center gap-1 text-xs font-bold bg-maroon text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      c.status === "approved" ? "bg-leaf/15 text-leaf" : "bg-maroon/15 text-maroon"
                    }`}>
                      {c.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="font-bold text-sm text-charcoal mb-3">Restaurants</p>
      <div className="bg-white rounded-2xl border border-line divide-y divide-line">
        {restaurants.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-leaf" />
              <span className="text-sm font-semibold text-charcoal">{r.name}</span>
            </div>
            <span className="text-xs text-[#9A9488]">{r.cuisine} &middot; {r.rating}★</span>
          </div>
        ))}
      </div>
    </main>
  );
}
