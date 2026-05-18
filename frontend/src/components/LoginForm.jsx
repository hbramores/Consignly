import { useState } from "react";
import {
  isValidPassword,
  isValidUsername,
  sanitizePassword,
  sanitizeUsername,
} from "../utils/inputValidation";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function LoginForm({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isValidUsername(username)) {
      setError("Username must be 3-30 characters and use only letters, numbers, or underscores.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be 6-72 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      onLoginSuccess(data.user);
    } catch {
      setError("Unable to connect to the server. Please make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Please enter your credentials.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-username">Username</Label>
            <Input
              id="login-username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(sanitizeUsername(event.target.value))}
              pattern="[A-Za-z0-9_]{3,30}"
              maxLength={30}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(sanitizePassword(event.target.value))}
              minLength={6}
              maxLength={72}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-muted-foreground"
            onClick={onSwitchToRegister}
          >
            Create an account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
