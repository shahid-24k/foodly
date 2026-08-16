"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function FavoriteButton({ restaurantId }: { restaurantId: string }) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      const { data: row } = await supabase.from("favorites").select("*").eq("user_id", data.user.id).eq("restaurant_id", restaurantId).maybeSingle();
      setSaved(!!row);
    });
  }, [restaurantId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) { window.location.href = "/login?next=/restaurants"; return; }
    const supabase = createClient();
    if (saved) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("restaurant_id", restaurantId);
      setSaved(false);
    } else {
      await supabase.from("favorites").insert([{ user_id: userId, restaurant_id: restaurantId }]);
      setSaved(true);
    }
  };

  return (
    <button onClick={toggle} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:shadow-md transition-all z-10" aria-label="Save to favorites">
      <Heart size={18} className={saved ? "fill-accent text-accent" : "text-text-muted"} />
    </button>
  );
}
