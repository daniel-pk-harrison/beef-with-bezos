"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AddMissForm } from "@/components/AddMissForm";
import { MissCard } from "@/components/MissCard";
import type { MissedDelivery } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [misses, setMisses] = useState<MissedDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch misses when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMisses();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchMisses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/misses");
      const data = await res.json();
      setMisses(data.misses || []);
    } catch (error) {
      console.error("Failed to fetch misses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Invalid password");
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setMisses([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddMiss = useCallback(async (date: string, note: string) => {
    const res = await fetch("/api/admin/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, note }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to add miss");
    }

    // Refresh the list
    await fetchMisses();
  }, []);

  const handleDeleteMiss = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMisses((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </main>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 mb-8 transition-colors"
          >
            <span>←</span>
            <span>Back to counter</span>
          </Link>

          <div className="bg-white/5 backdrop-blur-sm border border-rage-900/30 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/50 text-sm mb-6">
              Enter the password to report missed deliveries.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoFocus
                  className="w-full bg-black/30 border border-rage-900/50 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rage-500 focus:ring-1 focus:ring-rage-500 transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-rage-400 text-sm">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-rage-600 hover:bg-rage-500 disabled:bg-rage-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isLoggingIn ? "Checking..." : "Enter"}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    );
  }

  // Authenticated admin panel
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              <span>←</span>
              <span>Back to counter</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">
              Admin Panel
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white/80 text-sm transition-colors"
          >
            Logout
          </button>
        </motion.div>

        {/* Add miss form */}
        <div className="mb-8">
          <AddMissForm onAdd={handleAddMiss} />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-rage-900/30 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center justify-between">
            <span className="text-white/70">Total Missed Deliveries</span>
            <span className="text-3xl font-bold text-rage-400">
              {misses.length}
            </span>
          </div>
        </motion.div>

        {/* Misses list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-white/70 mb-4">
            All Incidents
          </h2>

          {isLoading ? (
            <div className="text-center text-white/50 py-8">Loading...</div>
          ) : misses.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              No missed deliveries recorded yet. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {misses.map((miss, index) => (
                  <MissCard
                    key={miss.id}
                    miss={miss}
                    index={index}
                    showDelete
                    onDelete={handleDeleteMiss}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
