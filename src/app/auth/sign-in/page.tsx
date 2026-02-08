"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/tko";
  };

  return (
    <div className="section">
      <div className="container-padded flex justify-center">
        <div className="card-next w-full max-w-md p-6">
          <h2 className="text-2xl font-semibold text-ink-900">Sign in</h2>
          <p className="text-sm text-ink-500">
            Access your account to manage orders and rewards.
          </p>

          <div className="mt-6 grid gap-3">
            <button
              className="btn btn-outline"
              onClick={() => signIn("google", { callbackUrl: "/tko" })}
              type="button"
            >
              Continue with Google
            </button>
            <button
              className="btn btn-outline"
              onClick={() => signIn("github", { callbackUrl: "/tko" })}
              type="button"
            >
              Continue with GitHub
            </button>
          </div>

          <div className="my-6 h-px bg-ink-100" />

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Email</label>
              <input
                className="input mt-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input mt-2"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-sm text-ink-500">
            New here?{" "}
            <Link href="/auth/sign-up" className="text-ink-900 underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
