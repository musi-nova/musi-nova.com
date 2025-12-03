import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const Unsubscribe: React.FC = () => {
  const { lead_id } = useParams<{ lead_id: string }>();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleUnsubscribe = async () => {
    if (!lead_id) return;
    setStatus("loading");
    console.log("Unsubscribing lead ID:", lead_id);
    try {
      const res = await apiFetch(`leads/email/${lead_id}/unsubscribe`, { method: "POST" });
      if (res.ok) {
        setStatus("success");
        setMessage("You have been unsubscribed successfully.");
      } else {
        setStatus("error");
        setMessage("There was a problem unsubscribing. Please try again later.");
      }
    } catch (e) {
      setStatus("error");
      setMessage("There was a problem unsubscribing. Please try again later.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-musinova-darkgray">Unsubscribe</h1>
        <p className="mb-6 text-musinova-darkgray">
          Click below to unsubscribe from our emails.
        </p>
        {status === "idle" && (
          <Button onClick={handleUnsubscribe} className="bg-musinova-brown text-white font-bold px-8 py-3 rounded-lg">
            Unsubscribe
          </Button>
        )}
        {status === "loading" && <p className="text-musinova-darkgray">Processing...</p>}
        {status !== "idle" && message && <p className="mt-4 text-musinova-darkgray">{message}</p>}
      </div>
    </section>
  );
};

export default Unsubscribe;
