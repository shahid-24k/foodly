"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Receipt, LogOut, LayoutDashboard, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login?next=/account"); return; }
      const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setProfile(p);
    });
  }, [router]);

  const logout = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!profile) return <div className="max-w-md mx-auto px-4 py-20 text-center text-[#9A9488]">Loading…</div>;

  return (
    <main className="max-w-md mx-auto px-4 md:px-8 py-6 pb-24">
      <h1 className="font-display font-black text-2xl text-charcoal mb-5">Account</h1>
      <div className="bg-white rounded-2xl border border-line p-4 flex items-center gap-3 mb-5">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border border-line" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-mango text-white flex items-center justify-center font-bold">
            {(profile.full_name || profile.email || "U").slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-sm text-charcoal">{profile.full_name}</p>
          <p className="text-xs text-[#9A9488] capitalize">{profile.role} &middot; {profile.email}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-line divide-y divide-line">
        <Link href="/orders" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-charcoal"><Receipt size={16} className="text-[#9A9488]" /> Orders</Link>
        <Link href="/favorites" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-charcoal"><Heart size={16} className="text-[#9A9488]" /> Favorites</Link>
        {profile.role === "restaurant" && (
          <Link href="/restaurant/dashboard" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-charcoal"><LayoutDashboard size={16} className="text-[#9A9488]" /> Restaurant dashboard</Link>
        )}
        {profile.role === "admin" && (
          <Link href="/admin/dashboard" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-charcoal"><LayoutDashboard size={16} className="text-[#9A9488]" /> Admin dashboard</Link>
        )}
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-maroon"><LogOut size={16} /> Log out</button>
      </div>
    </main>
  );
}
