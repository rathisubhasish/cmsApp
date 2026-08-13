import { useEffect, useState } from "react";
import { get } from "../network";

export function useContracts(tenantId) {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        if (!tenantId) return;

        let cancelled = false;

        (async () => {
            try {
                const { data } = await get(`/tenant/${tenantId}/contract`);
                const list = Array.isArray(data) ? data : data?.content ?? [];
                if (!cancelled) setContracts(list);
            } catch (error) {
                console.error("Failed to fetch contracts:", error);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [tenantId]);

    return { contracts };
}
