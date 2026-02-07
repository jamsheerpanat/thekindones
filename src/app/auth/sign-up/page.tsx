"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || "Unable to create account.");
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/"
    });
  };

  return (
    <div className="section">
      <div className="container-padded flex justify-center">
        <div className="card-next w-full max-w-md p-6">
          <h2 className="text-2xl font-semibold text-ink-900">Create account</h2>
          <p className="text-sm text-ink-500">
            Join thekindones and unlock rewards and faster checkout.
          </p>

          <div className="mt-6 grid gap-3">
            <button
              className="btn btn-outline"
              onClick={() => signIn("google")}
              type="button"
            >
              Continue with Google
            </button>
            <button
              className="btn btn-outline"
              onClick={() => signIn("github")}
              type="button"
            >
              Continue with GitHub
            </button>
          </div>

          <div className="my-6 h-px bg-ink-100" />

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Name</label>
              <input
                className="input mt-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
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
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-ink-500">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-ink-900 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
