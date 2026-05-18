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

function RegisterForm({ onRegistered, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!isValidUsername(username)) {
      setError("Username must be 3-30 characters and use only letters, numbers, or underscores.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be 6-72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      setMessage(data.message || "Account created successfully.");
      onRegistered?.();
    } catch {
      setError("Unable to connect to the server. Please make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Please fill in the form to create an account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-username">Username</Label>
            <Input
              id="register-username"
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
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(sanitizePassword(event.target.value))}
              minLength={6}
              maxLength={72}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Confirm Password</Label>
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(sanitizePassword(event.target.value))}
              minLength={6}
              maxLength={72}
              autoComplete="new-password"
              required
            />
          </div>

          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-muted-foreground"
            onClick={onSwitchToLogin}
          >
            Already have an account?
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;
