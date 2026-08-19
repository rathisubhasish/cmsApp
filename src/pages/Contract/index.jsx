import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InlineTab from "../../common/InlineTab/InlineTab";
import Loader from "../../common/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import { useContracts, contractId } from "../../hooks/useContracts";
import { humanize } from "../../services/utility";

const COLUMNS = ["Contract", "Proposal No", "Client", "Contract Type", "Billing Type", "Status"];

// An approval-stage tab belongs to the role that acts on it; other roles don't see it.
const APPROVAL_ROLE_BY_STATUS = {
    MANAGER_APPROVAL_PENDING: "MANAGER",
    FINANCE_APPROVAL_PENDING: "FINANCE",
    LEGAL_APPROVAL_PENDING: "LEGAL",
};

export default function Contract() {
    const { user } = useAuth();
    const tenantId = user?.tenantId;
    const { contracts, loading } = useContracts(tenantId);
    const navigate = useNavigate();

    const [status, setStatus] = useState("ALL");
    const [contractType, setContractType] = useState("All");

    const role = (user?.role || "").toUpperCase();

    const statuses = useMemo(() => {
        const fromData = [...new Set(contracts.map((contract) => contract.status).filter(Boolean))].filter(
            (s) => {
                const owner = APPROVAL_ROLE_BY_STATUS[(s || "").toUpperCase()];
                return !owner || owner === role;
            }
        );
        // The role's own approval queue is always a tab, even with nothing in it.
        const ownStage = Object.keys(APPROVAL_ROLE_BY_STATUS).find(
            (s) => APPROVAL_ROLE_BY_STATUS[s] === role
        );
        if (ownStage && !fromData.some((s) => (s || "").toUpperCase() === ownStage)) {
            fromData.push(ownStage);
        }
        return fromData;
    }, [contracts, role]);

    const contractTypes = useMemo(
        () => ["All", ...new Set(contracts.map((contract) => contract.contractType).filter(Boolean))],
        [contracts]
    );

    const byStatus = (value) =>
        contracts.filter((contract) => value === "ALL" || contract.status === value);

    const filteredContracts = byStatus(status).filter(
        (contract) => contractType === "All" || contract.contractType === contractType
    );

    const tabs = [{ value: "ALL", label: "All" }, ...statuses.map((s) => ({ value: s, label: humanize(s) }))].map(
        ({ value, label }) => ({
            title: `${label} (${byStatus(value).length})`,
            active: status === value,
            onClick: () => setStatus(value),
        })
    );

    return (
        <div>
            <h1 className="text-xl font-semibold text-text-primary">Contract</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage all contracts in your workspace</p>

            <div className="mt-6 flex items-center justify-between gap-4">
                <InlineTab tabs={tabs} />

                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary" htmlFor="contract-type-filter">
                        Type
                    </label>
                    <select
                        id="contract-type-filter"
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    >
                        {contractTypes.map((type) => (
                            <option key={type} value={type}>
                                {type === "All" ? "All Types" : humanize(type)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            {COLUMNS.map((col) => (
                                <th key={col} className="whitespace-nowrap px-4 py-3 font-semibold text-primary-text">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContracts.map((contract) => (
                            <tr key={contractId(contract)} className="border-b border-border last:border-b-0">
                                <td className="whitespace-nowrap px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/contract/${contractId(contract)}`, { state: { contract } })
                                        }
                                        className="font-medium text-primary-text underline-offset-2 hover:underline"
                                    >
                                        {contract.contractTitle || "-"}
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                                    {contract.proposal?.proposalNumber || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                                    {contract.proposal?.clientName || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                                    {humanize(contract.contractType)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                                    {humanize(contract.billingType)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                                    {humanize(contract.status)}
                                </td>
                            </tr>
                        ))}
                        {loading && (
                            <tr>
                                <td colSpan={COLUMNS.length}>
                                    <Loader label="Loading contracts..." />
                                </td>
                            </tr>
                        )}
                        {!loading && filteredContracts.length === 0 && (
                            <tr>
                                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-sm text-text-secondary">
                                    No contracts found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
