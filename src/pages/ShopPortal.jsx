import { useState } from "react";
import { sanitizeCode } from "../utils/inputValidation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authBg from "../assets/auth_bg.png";

const AUTH_BACKGROUND_IMAGE = authBg;

function ShopPortal({ onShopLogin, onBack }) {
    
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  const handleShopLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/shops/shop-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_code: accessCode.trim() }),
    });

    const data = await res.json();

    if (res.ok) {
      setError("");
      onShopLogin(data.shop);
    } else {
      setError(data.message || "Invalid shop access code");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden bg-background lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]">
      <section className="flex flex-col items-center justify-center gap-4 p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-4">
          <Button variant="outline" onClick={onBack} className="w-full">
            Back to Artisan Login
          </Button>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Shop Owner Portal</CardTitle>
              <CardDescription>Enter your shop access code.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleShopLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Access Code</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Enter shop code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(sanitizeCode(e.target.value))}
                    maxLength={40}
                    autoComplete="one-time-code"
                    required
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button className="w-full" type="submit">
                  Enter Portal
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        className="relative hidden min-h-screen min-w-0 items-center justify-center bg-cover bg-center p-10 lg:flex"
        style={{ backgroundImage: `url(${AUTH_BACKGROUND_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-background/65" />
        <div className="relative max-w-lg min-w-0 space-y-4 text-center">
          <p className="text-4xl font-medium uppercase tracking-wide text-primary xl:text-5xl [text-shadow:0_2px_12px_rgba(255,255,255,0.8)]">
            Manage Smartly,
          </p>

          <blockquote className="text-4xl font-semibold leading-tight text-muted-foreground xl:text-5xl [text-shadow:0_2px_12px_rgba(255,255,255,0.8)]">
            Sell Seamlessly.
          </blockquote>
        </div>
      </section>
    </div>
  );
}

export default ShopPortal;
