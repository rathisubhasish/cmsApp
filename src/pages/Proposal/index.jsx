import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import InlineTab from "../../common/InlineTab/InlineTab";
import Button from "../../common/Button/Button";
import Modal from "../../Modal";
import { useAuth } from "../../context/AuthContext";
import { useProposals } from "../../hooks/useProposals";

const STATUS_TABS = ["DRAFT", "COMPLETE", "DECLINE"];

const COLUMNS = ["Proposal No", "Title", "Client", "Status", "Start Date"];

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const FORM = {
    title: "",
    clientName: "",
    amount: "",
    description: "",
};

export default function Proposal() {
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log("user",user)
    const tenantId = user?.tenantId;
    const { proposals, saving, addProposal } = useProposals(tenantId);

    const [status, setStatus] = useState(STATUS_TABS[0]);
    const [proposalModal, setProposalModal] = useState(false);
    const [proposalForm, setProposalForm] = useState(FORM);

    const filteredProposals = proposals.filter(
        (proposal) => (proposal.status || "").toUpperCase() === status
    );

    const tabs = STATUS_TABS.map((title) => ({
        title,
        active: status === title,
        onClick: () => setStatus(title),
    }));

    const handleFieldChange = (field) => (e) => {
        setProposalForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const closeProposalModal = () => {
        setProposalModal(false);
        setProposalForm(FORM);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addProposal({ ...proposalForm, status: "DRAFT" });
        if (success) closeProposalModal();
    };

    return (
        <div>
            <h1 className="text-xl font-semibold text-text-primary">Proposal</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage your proposals</p>

            <div className="mt-6 flex items-center justify-between gap-4">
                <InlineTab tabs={tabs} />

                <Button
                    className="!w-auto flex items-center gap-2 !py-2 px-4"
                    onClick={() => setProposalModal(true)}
                >
                    <LuPlus className="h-4 w-4" />
                    Add Proposal
                </Button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[700px] text-left text-sm">
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
                        {filteredProposals.map((proposal) => (
                            <tr key={proposal.id} className="border-b border-border last:border-b-0">
                                <td className="whitespace-nowrap px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/proposal-discussion/${proposal.id}`, { state: { proposal } })
                                        }
                                        className="font-medium text-primary-text underline-offset-2 hover:underline"
                                    >
                                        {proposal.proposalNumber || "-"}
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-primary">{proposal.title || "-"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{proposal.clientName || "-"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{proposal.status || "-"}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                                    {formatDate(proposal.proposalStartDate)}
                                </td>
                            </tr>
                        ))}
                        {filteredProposals.length === 0 && (
                            <tr>
                                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-sm text-text-secondary">
                                    No proposals found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {proposalModal && (
                <Modal title="Add Proposal" onClose={closeProposalModal} width={560}>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium text-text-primary">Title</label>
                            <input
                                type="text"
                                required
                                value={proposalForm.title}
                                onChange={handleFieldChange("title")}
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-text-primary">Client Name</label>
                            <input
                                type="text"
                                required
                                value={proposalForm.clientName}
                                onChange={handleFieldChange("clientName")}
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-text-primary">Amount</label>
                            <input
                                type="number"
                                required
                                value={proposalForm.amount}
                                onChange={handleFieldChange("amount")}
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium text-text-primary">Description</label>
                            <textarea
                                value={proposalForm.description}
                                onChange={handleFieldChange("description")}
                                rows={3}
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                            />
                        </div>

                        <div className="col-span-2 mt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeProposalModal}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-primary-light"
                            >
                                Cancel
                            </button>
                            <Button type="submit" className="!w-auto px-4" loading={saving}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
