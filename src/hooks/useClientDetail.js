import { useCallback, useEffect, useState } from "react";
import { get, post } from "../network";

const unwrap = (data) => data?.data ?? data;
const unwrapList = (data) =>
    Array.isArray(data) ? data : data?.data ?? data?.content ?? data?.data?.content ?? [];

export function useClient(clientId, initialClient = null) {
    const [client, setClient] = useState(initialClient);
    const [loading, setLoading] = useState(!initialClient);

    useEffect(() => {
        if (!clientId || initialClient) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const { data } = await get(`/tenant/client/${clientId}`);
                if (!cancelled) setClient(unwrap(data));
            } catch (error) {
                console.error("Failed to fetch client:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [clientId, initialClient]);

    return { client, loading };
}

export function useClientMembers(clientId) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(!!clientId);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!clientId) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await get(`/tenant/client/${clientId}/user`);
                if (!cancelled) setMembers(unwrapList(data));
            } catch (err) {
                console.error("Failed to fetch client members:", err);
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [clientId]);

    const createMember = useCallback(async (payload) => {
        setSaving(true);
        try {
            const { data } = await post(`/tenant/client/${clientId}/user`, payload);
            const newMember = unwrap(data);
            setMembers((prev) => (newMember && typeof newMember === "object" ? [...prev, newMember] : prev));
            return true;
        } catch (err) {
            console.error("Failed to create client member:", err);
            return false;
        } finally {
            setSaving(false);
        }
    }, [clientId]);

    return { members, loading, error, saving, createMember };
}
