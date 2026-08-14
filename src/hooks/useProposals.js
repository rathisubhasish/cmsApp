import { useCallback, useEffect, useState } from "react";
import { get, post } from "../network";

export function useProposals(tenantId) {
    const [proposals, setProposals] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!tenantId) return;

        let cancelled = false;

        (async () => {
            try {
                const { data } = await get(`/tenant/proposal`);
                const list = Array.isArray(data) ? data : data?.content ?? [];
                if (!cancelled) setProposals(list);
            } catch (error) {
                console.error("Failed to fetch proposals:", error);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [tenantId]);

    const addProposal = useCallback(async (payload) => {
        setSaving(true);
        try {
            const { data } = await post(`/tenant/proposal`, payload);
            setProposals((prev) => [...prev, data]);
            return true;
        } catch (error) {
            console.error("Failed to create proposal:", error);
            return false;
        } finally {
            setSaving(false);
        }
    }, [tenantId]);

    return { proposals, saving, addProposal };
}
