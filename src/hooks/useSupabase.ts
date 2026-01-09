"use client";

import { useState, useEffect, useCallback } from "react";
import * as db from "@/lib/supabase-client";
import type { Property, Contact, Deal, FunnelStage, Developer } from "@/types";

// Hook for fetching properties
export function useProperties(filters?: Parameters<typeof db.getProperties>[0]) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getProperties(filters);
      setProperties(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}

// Hook for fetching a single property
export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await db.getPropertyById(id);
        setProperty(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch property");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetch();
  }, [id]);

  return { property, loading, error };
}

// Hook for fetching contacts
export function useContacts(filters?: Parameters<typeof db.getContacts>[0]) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getContacts(filters);
      setContacts(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { contacts, loading, error, refetch: fetchContacts };
}

// Hook for fetching deals with stages
export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dealsData, stagesData] = await Promise.all([
        db.getDeals(),
        db.getFunnelStages(),
      ]);
      setDeals(dealsData);
      setStages(stagesData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch deals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateDealStage = async (dealId: string, stageId: string) => {
    const updated = await db.updateDealStage(dealId, stageId);
    if (updated) {
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage_id: stageId } : d));
    }
    return updated;
  };

  return { deals, stages, loading, error, refetch: fetchData, updateDealStage };
}

// Hook for fetching developers
export function useDevelopers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await db.getDevelopers();
        setDevelopers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { developers, loading };
}

// Hook for dashboard stats
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalContacts: 0,
    activeDeals: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgDealValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await db.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { stats, loading };
}

// Hook for communications
export function useCommunications(contactId: string) {
  const [messages, setMessages] = useState<Awaited<ReturnType<typeof db.getCommunications>>>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!contactId) return;
    setLoading(true);
    try {
      const data = await db.getCommunications(contactId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (content: string, type: "whatsapp" | "email" = "whatsapp") => {
    const sent = await db.sendMessage({
      contact_id: contactId,
      type,
      content,
      direction: "out",
    });
    if (sent) {
      setMessages((prev: Awaited<ReturnType<typeof db.getCommunications>>) => [...prev, sent]);
    }
    return sent;
  };

  return { messages, loading, refetch: fetchMessages, sendMessage };
}

// Hook for AI generation
export function useAIGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (type: string, data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Generation failed");
      }

      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
}

// Hook for DLD data
export function useDLDTransactions(filters?: { area?: string; limit?: number }) {
  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("unknown");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.area) params.set("area", filters.area);
      if (filters?.limit) params.set("limit", String(filters.limit));

      const response = await fetch(`/api/dld/sync?${params}`);
      const result = await response.json();
      
      setTransactions(result.data || []);
      setSource(result.source || "unknown");
    } catch (err) {
      console.error("Error fetching DLD data:", err);
    } finally {
      setLoading(false);
    }
  }, [filters?.area, filters?.limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, source, refetch: fetchTransactions };
}
