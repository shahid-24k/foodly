"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Package, Clock, TrendingUp, Plus, Pencil, Trash2, X, Store, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Order, MenuItem, Restaurant, STATUS_STEPS, money } from "@/lib/types";

const EMPTY_ITEM = { name: "", description: "", price: "", category: "", is_veg: true };

export default function RestaurantDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [claimRequests, setClaimRequests] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [claimMessage, setClaimMessage] = useState<string>("");
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [tab, setTab] = useState<"orders" | "menu">("orders");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<typeof EMPTY_ITEM>(EMPTY_ITEM);
  const [showForm, setShowForm] = useState(false);

  const loadMenu = async (restaurantId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId);
    setMenu(data || []);
  };

  const loadClaimData = async (userId: string) => {
    const supabase = createClient();
    const { data: restaurants } = await supabase.from("restaurants").select("*");
    setAllRestaurants(restaurants || []);

    try {
      const { data: claims } = await supabase.from("claim_requests").select("*, restaurant:restaurants(name)").eq("user_id", userId);
      setClaimRequests(claims || []);
    } catch {
      // claim_requests table may not exist yet
      setClaimRequests([]);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setProfile(p);
      if (p?.restaurant_id) {
        const { data: rows } = await supabase.from("orders").select("*").eq("restaurant_id", p.restaurant_id).order("created_at", { ascending: false });
        setOrders(rows || []);
        loadMenu(p.restaurant_id);
      } else {
        loadClaimData(data.user.id);
      }
    });
  }, [router]);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;
    setSubmittingClaim(true);
    const supabase = createClient();
    const { error } = await supabase.from("claim_requests").insert([{
      user_id: profile.id,
      restaurant_id: selectedRestaurant,
      message: claimMessage,
    }]);
    setSubmittingClaim(false);
    if (error) {
      alert("Could not submit claim request: " + error.message + "\n\nEnsure supabase/claim_requests.sql has been executed.");
      return;
    }
    alert("Claim request submitted! An administrator will review it shortly.");
    loadClaimData(profile.id);
  };

  const advanceOrder = async (order: Order) => {
    if (order.status_index >= STATUS_STEPS.length - 1) return;
    const supabase = createClient();
    const next = order.status_index + 1;
    await supabase.from("orders").update({ status_index: next }).eq("id", order.id);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status_index: next } : o)));
  };

  const openNew = () => { setEditing(null); setForm(EMPTY_ITEM); setShowForm(true); };
  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", price: String(item.price), category: item.category, is_veg: item.is_veg });
    setShowForm(true);
  };

  const saveItem = async () => {
    if (!profile?.restaurant_id || !form.name || !form.price || !form.category) return;
    const supabase = createClient();
    if (editing) {
      await supabase.from("menu_items").update({
        name: form.name, description: form.description, price: Number(form.price), category: form.category, is_veg: form.is_veg,
      }).eq("id", editing.id);
    } else {
      const id = `${form.name}-${Date.now()}`.replace(/\s+/g, "-").toLowerCase();
      await supabase.from("menu_items").insert([{
        id, restaurant_id: profile.restaurant_id, name: form.name, description: form.description,
        price: Number(form.price), category: form.category, is_veg: form.is_veg,
      }]);
    }
    setShowForm(false);
    loadMenu(profile.restaurant_id);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await createClient().from("menu_items").delete().eq("id", id);
    loadMenu(profile.restaurant_id);
  };

  if (!profile) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-[#9A9488]">Loading…</div>;

  // Unlinked restaurant user flow: Claim a restaurant
  if (!profile.restaurant_id) {
    const pendingClaim = claimRequests.find(c => c.status === "pending");
    return (
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 pb-16">
        <h1 className="font-display font-black text-2xl text-charcoal mb-2">Claim Your Restaurant</h1>
        <p className="text-sm text-[#9A9488] mb-6">
          Select your restaurant to request owner access on FOODLY. Once approved by an admin, your dashboard and menu editor will be unlocked.
        </p>

        {pendingClaim ? (
          <div className="bg-white rounded-2xl border border-line p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-mango/10 text-mango flex items-center justify-center mx-auto">
              <Clock size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal">Claim Request Pending</h3>
            <p className="text-sm text-[#55504A]">
              Your claim request for <strong className="text-charcoal">{pendingClaim.restaurant?.name || pendingClaim.restaurant_id}</strong> has been submitted and is currently under review by our admin team.
            </p>
            <span className="inline-block text-xs font-semibold px-3 py-1 bg-mango/15 text-maroon rounded-full">
              Status: Pending Review
            </span>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="bg-white rounded-2xl border border-line p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#9A9488] mb-2 uppercase tracking-wide">
                Select Restaurant
              </label>
              <select
                required
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="w-full text-sm border border-line rounded-xl px-4 py-3 outline-none focus:border-mango bg-white"
              >
                <option value="">-- Choose a restaurant --</option>
                {allRestaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.locality})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9A9488] mb-2 uppercase tracking-wide">
                Note / Proof of Ownership (Optional)
              </label>
              <textarea
                placeholder="e.g. Owner of Hotel Sri Rajeshwari, Krishnagiri"
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                className="w-full text-sm border border-line rounded-xl px-4 py-3 outline-none focus:border-mango min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingClaim || !selectedRestaurant}
              className="w-full bg-mango disabled:opacity-50 text-white font-bold py-3.5 rounded-xl hover:bg-maroon transition-colors"
            >
              {submittingClaim ? "Submitting Request…" : "Submit Claim Request"}
            </button>
          </form>
        )}

        {claimRequests.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display font-bold text-sm text-charcoal mb-3">Claim Request History</h3>
            <div className="space-y-2">
              {claimRequests.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-line p-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-charcoal">{c.restaurant?.name || c.restaurant_id}</p>
                    <p className="text-[#9A9488] mt-0.5">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-bold px-2.5 py-1 rounded-full uppercase text-[10px] ${
                    c.status === "approved" ? "bg-leaf/15 text-leaf" :
                    c.status === "rejected" ? "bg-maroon/15 text-maroon" :
                    "bg-mango/15 text-maroon"
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    );
  }

  const pending = orders.filter((o) => o.status_index < STATUS_STEPS.length - 1).length;
  const revenue = orders.reduce((a, o) => a + o.total, 0);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 pb-16">
      <h1 className="font-display font-black text-2xl text-charcoal mb-1">Restaurant dashboard</h1>
      <p className="text-sm text-[#9A9488] mb-6">Managing {profile.restaurant_id}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total revenue", value: money(revenue), icon: DollarSign },
          { label: "Total orders", value: String(orders.length), icon: Package },
          { label: "Pending orders", value: String(pending), icon: Clock },
          { label: "Avg order value", value: orders.length ? money(Math.round(revenue / orders.length)) : "₹0", icon: TrendingUp },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-line p-4">
            <c.icon size={18} className="text-mango" />
            <p className="text-xl font-black text-charcoal mt-2">{c.value}</p>
            <p className="text-xs text-[#9A9488]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 border-b border-line">
        {(["orders", "menu"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-sm font-bold capitalize border-b-2 -mb-px ${tab === t ? "border-mango text-charcoal" : "border-transparent text-[#9A9488]"}`}>{t}</button>
        ))}
      </div>

      {tab === "orders" && (
        orders.length === 0 ? (
          <p className="text-sm text-[#9A9488]">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-charcoal">#{o.id}</p>
                  <p className="text-xs text-[#9A9488]">{o.items.length} items &middot; {money(o.total)} &middot; {o.payment_method.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E86A2E]/20 text-maroon">{STATUS_STEPS[o.status_index]}</span>
                  {o.status_index < STATUS_STEPS.length - 1 && (
                    <button onClick={() => advanceOrder(o)} className="text-xs font-bold bg-charcoal text-white px-3 py-1.5 rounded-lg">Advance</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "menu" && (
        <div>
          <button onClick={openNew} className="flex items-center gap-1.5 text-xs font-bold bg-mango text-white px-3 py-2 rounded-lg mb-4"><Plus size={14} /> Add item</button>
          <div className="space-y-2">
            {menu.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-line p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-charcoal">{item.name} <span className="text-[#9A9488] font-normal">&middot; {item.category}</span></p>
                  <p className="text-xs text-[#9A9488] mt-0.5">{money(item.price)} &middot; {item.is_veg ? "Veg" : "Non-veg"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 border border-line rounded-lg"><Pencil size={13} /></button>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 border border-line rounded-lg text-maroon"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {menu.length === 0 && <p className="text-sm text-[#9A9488]">No menu items yet.</p>}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full md:max-w-sm rounded-t-2xl md:rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-charcoal">{editing ? "Edit item" : "Add item"}</h3>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <div className="space-y-2">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
              <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
              <input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
              <input placeholder="Category (e.g. Biryani, Starters)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button key={String(v)} onClick={() => setForm({ ...form, is_veg: v })} className={`flex-1 text-xs font-bold py-2 rounded-lg border ${form.is_veg === v ? "bg-charcoal text-white border-charcoal" : "border-line text-[#6B6155]"}`}>{v ? "Veg" : "Non-veg"}</button>
                ))}
              </div>
              <button onClick={saveItem} className="w-full bg-mango text-white font-bold py-3 rounded-xl mt-2">{editing ? "Save changes" : "Add item"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
