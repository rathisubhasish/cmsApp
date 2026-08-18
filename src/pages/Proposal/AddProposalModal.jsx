import { useState } from "react";
import Button from "../../common/Button/Button";
import Modal from "../../Modal";
import { useClients } from "../../hooks/useClients";
import { useClientMembers } from "../../hooks/useClientDetail";
import { BILLING_OPTIONS, humanize, toIso } from "../../services/utility";

const FORM = {
    title: "",
    description: "",
    clientId: "",
    clientUserId: "",
    proposalStartDate: "",
    proposalAmount: "",
    billing: "",
    startDate: "",
    endDate: "",
};

const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60";

export default function AddProposalModal({ tenantId, createdBy, saving, onClose, onSubmit }) {
    const { clients, loading: loadingClients } = useClients(tenantId);
    const [form, setForm] = useState(FORM);
    // Client users depend on the selected client, so the list refetches as it changes.
    const { members, loading: loadingMembers } = useClientMembers(form.clientId);

    const handleChange = (field) => (e) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            [field]: value,
            // A different client invalidates the previously picked contact.
            ...(field === "clientId" ? { clientUserId: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit({
            title: form.title,
            description: form.description,
            clientId: Number(form.clientId),
            clientUserId: Number(form.clientUserId),
            proposalStartDate: toIso(form.proposalStartDate),
            proposalAmount: Number(form.proposalAmount),
            billing: form.billing,
            startDate: toIso(form.startDate),
            endDate: toIso(form.endDate),
            createdBy,
            createdAt: new Date().toISOString(),
        });
        if (success) onClose();
    };

    return (
        <Modal title="Add Proposal" onClose={onClose} width={640}>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-text-primary">Title</label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={handleChange("title")}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Client</label>
                    <select
                        required
                        disabled={loadingClients}
                        value={form.clientId}
                        onChange={handleChange("clientId")}
                        className={inputClass}
                    >
                        <option value="" disabled>
                            {loadingClients ? "Loading..." : "Select client"}
                        </option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name || client.email || client.id}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Client User</label>
                    <select
                        required
                        disabled={!form.clientId || loadingMembers}
                        value={form.clientUserId}
                        onChange={handleChange("clientUserId")}
                        className={inputClass}
                    >
                        <option value="" disabled>
                            {!form.clientId
                                ? "Select a client first"
                                : loadingMembers
                                  ? "Loading..."
                                  : "Select client user"}
                        </option>
                        {members.map((member) => (
                            <option key={member.id} value={member.id}>
                                {[member.firstname, member.lastname].filter(Boolean).join(" ") || member.email}
                                {member.email ? ` (${member.email})` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">
                        Proposal Start Date
                    </label>
                    <input
                        type="datetime-local"
                        required
                        value={form.proposalStartDate}
                        onChange={handleChange("proposalStartDate")}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Proposal Amount</label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={form.proposalAmount}
                        onChange={handleChange("proposalAmount")}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Billing</label>
                    <select
                        required
                        value={form.billing}
                        onChange={handleChange("billing")}
                        className={inputClass}
                    >
                        <option value="" disabled>
                            Select billing
                        </option>
                        {BILLING_OPTIONS.map((value) => (
                            <option key={value} value={value}>
                                {humanize(value)}
                            </option>
                        ))}
                    </select>
                </div>

                <div />

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Start Date</label>
                    <input
                        type="datetime-local"
                        required
                        value={form.startDate}
                        onChange={handleChange("startDate")}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">End Date</label>
                    <input
                        type="datetime-local"
                        required
                        min={form.startDate || undefined}
                        value={form.endDate}
                        onChange={handleChange("endDate")}
                        className={inputClass}
                    />
                </div>

                <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-text-primary">Description</label>
                    <textarea
                        rows={3}
                        value={form.description}
                        onChange={handleChange("description")}
                        className={inputClass}
                    />
                </div>

                <div className="col-span-2 mt-2 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
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
    );
}
