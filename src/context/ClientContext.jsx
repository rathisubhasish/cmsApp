import { createContext, useContext, useState, useCallback } from "react";
import apiClient from "../services/apiClient";

const ClientContext = createContext(null);

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/clients");
      setClients(data);
      return { success: true, data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (payload) => {
    const { data } = await apiClient.post("/clients", payload);
    setClients((prev) => [...prev, data]);
    return data;
  }, []);

  const updateClient = useCallback(async (id, payload) => {
    const { data } = await apiClient.put(`/clients/${id}`, payload);
    setClients((prev) => prev.map((client) => (client.id === id ? data : client)));
    return data;
  }, []);

  const deleteClient = useCallback(async (id) => {
    await apiClient.delete(`/clients/${id}`);
    setClients((prev) => prev.filter((client) => client.id !== id));
  }, []);

  const value = {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export function useClients() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClients must be used within ClientProvider");
  return ctx;
}
