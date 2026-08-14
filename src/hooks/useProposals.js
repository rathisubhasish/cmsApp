import { useCallback, useEffect, useState } from "react";
import { get, post } from "../network";

const unwrapList = (data) => (Array.isArray(data) ? data : data?.data ?? data?.content ?? []);

export function useProposal(proposalId, initialProposal = null) {
    const [proposal, setProposal] = useState(initialProposal);
    const [loading, setLoading] = useState(!initialProposal);
    const [savingDiscussion, setSavingDiscussion] = useState(false);

    useEffect(() => {
        if (!proposalId || initialProposal) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const { data } = await get(`/tenant/proposal`);
                const found = unwrapList(data).find((item) => item.id === proposalId) ?? null;
                if (!cancelled) setProposal(found);
            } catch (error) {
                console.error("Failed to fetch proposal:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [proposalId, initialProposal]);

    const addDiscussion = useCallback(async (payload) => {
        setSavingDiscussion(true);
        try {
            const { data } = await post(`/tenant/proposal/${proposalId}/discussion`, payload);
            const newDiscussion = data?.data ?? data;
            setProposal((prev) =>
                prev
                    ? {
                          ...prev,
                          proposalDiscussion: [
                              ...(prev.proposalDiscussion ?? []),
                              newDiscussion && typeof newDiscussion === "object" ? newDiscussion : payload,
                          ],
                      }
                    : prev
            );
            return true;
        } catch (error) {
            console.error("Failed to create proposal discussion:", error);
            return false;
        } finally {
            setSavingDiscussion(false);
        }
    }, [proposalId]);

    return { proposal, loading, savingDiscussion, addDiscussion };
}

export function useProposals(tenantId) {
    const [proposals, setProposals] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!tenantId) return;

        let cancelled = false;

        (async () => {
            try {
                const { data } = await get(`/tenant/proposal`);
                const list = unwrapList(data);
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
            const newProposal = data?.data ?? data;
            setProposals((prev) => [...prev, newProposal]);
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
