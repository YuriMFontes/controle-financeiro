import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./Dashboard.css";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error) setProfile(data);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {profile ? (
        <p>Bem-vindo, {profile.full_name}!</p>
      ) : (
        <p>Carregando perfil...</p>
      )}
    </div>
  );
}
