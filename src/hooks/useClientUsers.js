import { useCallback, useEffect, useState } from "react";
import { get, post } from "../network";

export function useClientUsers(clientId) {
    const [clientUsers, setClientUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!clientId) {
                setClientUsers([]);
                return;
            }
            setLoading(true);
            try {
                const { data } = await get(`/tenant/client/${clientId}/user`);
                const list = Array.isArray(data) ? data : data?.data ?? data?.content ?? [];
                if (!cancelled) setClientUsers(list);
            } catch (error) {
                console.error("Failed to fetch client users:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [clientId]);

    const addClientUser = useCallback(
        async (payload) => {
            if (!clientId) return null;
            setSaving(true);
            try {
                const { data } = await post(`/tenant/client/${clientId}/user`, payload);
                const created = data?.data ?? data;
                setClientUsers((prev) => [...prev, created]);
                return created;
            } catch (error) {
                console.error("Failed to add client user:", error);
                return null;
            } finally {
                setSaving(false);
            }
        },
        [clientId]
    );

    return { clientUsers, loading, saving, addClientUser };
}
