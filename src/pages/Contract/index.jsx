import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye } from "react-icons/lu";
import InlineTab from "../../common/InlineTab/InlineTab";
import { useAuth } from "../../context/AuthContext";
import { useContracts } from "../../hooks/useContracts";

const STATUS_TABS = ["Active", "Closed", "Pending"];

const COLUMNS = ["Contract", "Client", "Role", "Status", "Start Date", "End Date", "Actions"];

export default function Contract() {
    const { user } = useAuth();
    const tenantId = user?.tenantId;
    const { contracts } = useContracts(tenantId);
    const navigate = useNavigate();

    const [status, setStatus] = useState(STATUS_TABS[0]);
    const [role, setRole] = useState("All");

    const roles = useMemo(() => {
        const unique = new Set(contracts.map((contract) => contract.role).filter(Boolean));
        return ["All", ...unique];
    }, [contracts]);

    const filteredContracts = contracts.filter((contract) => {
        const matchesStatus = (contract.status || "").toLowerCase() === status.toLowerCase();
        const matchesRole = role === "All" || contract.role === role;
        return matchesStatus && matchesRole;
    });

    const tabs = STATUS_TABS.map((title) => ({
        title,
        active: status === title,
        onClick: () => setStatus(title),
    }));

    return (
        <div>
            <h1 className="text-xl font-semibold text-text-primary">Contract</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage all contracts in your workspace</p>

            <div className="mt-6 flex items-center justify-between gap-4">
                <InlineTab tabs={tabs} />

                <div className="flex items-center gap-3">
                    <label className="text-sm text-text-secondary" htmlFor="contract-role-filter">
                        Role
                    </label>
                    <select
                        id="contract-role-filter"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r === "All" ? "All Roles" : r}
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
                            <tr key={contract.id} className="border-b border-border last:border-b-0">
                                <td className="whitespace-nowrap px-4 py-3 text-text-primary">{contract.title}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{contract.clientName}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{contract.role}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{contract.status}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{contract.startDate}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{contract.endDate}</td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/proposal-discussion/${contract.id}`)}
                                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-primary-light"
                                    >
                                        <LuEye className="h-3.5 w-3.5" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredContracts.length === 0 && (
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
