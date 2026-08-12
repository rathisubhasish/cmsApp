import { useCallback, useEffect, useState } from "react";
import { get, post } from "../network";

export function useClients(tenantId) {
    const [clients, setClients] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!tenantId) return;

        let cancelled = false;

        (async () => {
            try {
                const { data } = await get(`/tenant/${tenantId}/client`);
                if (!cancelled) setClients(data);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [tenantId]);

    const addClient = useCallback(async (payload) => {
        setSaving(true);
        try {
            const { data } = await post(`/tenant/${tenantId}/client`, payload);
            setClients((prev) => [...prev, data]);
            return true;
        } catch (error) {
            console.error("Failed to create client:", error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [tenantId]);

    return { clients, saving, addClient };
}
