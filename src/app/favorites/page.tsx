"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant } from "@/lib/types";

export default function FavoritesPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login?next=/favorites"); return; }
      const { data: favs } = await supabase.from("favorites").select("restaurant_id").eq("user_id", data.user.id);
      const ids = (favs || []).map((f) => f.restaurant_id);
      if (ids.length === 0) { setLoading(false); return; }
      const { data: rows } = await supabase.from("restaurants").select("*").in("id", ids);
      setRestaurants(rows || []);
      setLoading(false);
    });
  }, [router]);

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-6 pb-24">
      <h1 className="font-display font-black text-2xl text-charcoal mb-5">Favorites</h1>
      {loading ? (
        <p className="text-sm text-[#9A9488]">Loading…</p>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={36} className="text-line mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-bold text-charcoal">Tap the heart on a restaurant to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {restaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      )}
    </main>
  );
}
