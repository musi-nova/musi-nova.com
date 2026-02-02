import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

const Unsubscribe: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    const search = location.search || "";
    if (!search) return;

    const params = new URLSearchParams(search);

    // Common keys to check
    let found = params.get("email") || params.get("e") || params.get("emailAddress") || params.get("em");

    // If no named key, try to get the first value (handles `?=user@host` or `?user@host`)
    if (!found) {
      const first = params.values().next();
      if (!first.done) found = first.value;
    }

    if (found) setEmail(found);
  }, [location.search]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    console.log("Unsubscribing email:", email);

    try {
      const endpoint = `leads/email/unsubscribe-by-email?email=${encodeURIComponent(email)}`;
      const res = await apiFetch(endpoint, { method: "POST" });
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
          Enter your email address to unsubscribe from our emails.
        </p>
        {status === "idle" && (
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={handleUnsubscribe} 
              className="bg-musinova-brown text-white font-bold px-8 py-3 rounded-lg w-full"
            >
              Unsubscribe
            </Button>
          </div>
        )}
        {status === "loading" && <p className="text-musinova-darkgray">Processing...</p>}
        {status !== "idle" && message && <p className="mt-4 text-musinova-darkgray">{message}</p>}
      </div>
    </section>
  );
};

export default Unsubscribe;
