import { useCallback, useEffect, useState } from "react";
import { get, post } from "../network";

const unwrapList = (data) => (Array.isArray(data) ? data : data?.data ?? data?.content ?? []);

export const contractId = (contract) => contract?.Id ?? contract?.id;

export function useContract(id, initialContract = null) {
    const [contract, setContract] = useState(initialContract);
    const [loading, setLoading] = useState(!initialContract);

    useEffect(() => {
        if (!id || initialContract) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const { data } = await get(`/tenant/contract`);
                const found = unwrapList(data).find((item) => contractId(item) === id) ?? null;
                if (!cancelled) setContract(found);
            } catch (error) {
                console.error("Failed to fetch contract:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, initialContract]);

    return { contract, loading };
}

export function useCreateContract() {
    const [saving, setSaving] = useState(false);

    const createContract = useCallback(async (payload) => {
        setSaving(true);
        try {
            await post(`/tenant/contract`, payload);
            return true;
        } catch (error) {
            console.error("Failed to create contract:", error);
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    return { saving, createContract };
}

export function useContracts(tenantId) {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(!!tenantId);

    useEffect(() => {
        if (!tenantId) return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const { data } = await get(`/tenant/contract`);
                const list = unwrapList(data);
                if (!cancelled) setContracts(list);
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [tenantId]);

    return { contracts, loading };
}
