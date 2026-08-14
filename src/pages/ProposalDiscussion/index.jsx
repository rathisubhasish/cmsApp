import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuCalendar, LuPlus } from "react-icons/lu";
import Button from "../../common/Button/Button";
import Modal from "../../Modal";
import { useAuth } from "../../context/AuthContext";
import { useClientMembers } from "../../hooks/useClientDetail";
import { useProposal } from "../../hooks/useProposals";

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          });
};

const DISCUSSION_FIELDS = [
    { label: "Description", key: "description" },
    { label: "Requirement", key: "requirement" },
    { label: "Remarks", key: "remarks" },
];

const DISCUSSION_TEXTAREAS = [
    { label: "Description", key: "description", required: true },
    { label: "Requirement", key: "requirement", required: false },
    { label: "Remarks", key: "remarks", required: false },
];

function DiscussionFormModal({ proposalId, clientId, tenantUserId, clientUserId, saving, onClose, onSubmit }) {
    const { members, loading: loadingMembers } = useClientMembers(clientId);
    const [form, setForm] = useState({
        clientUserId: clientUserId ?? "",
        meetingDate: "",
        title: "",
        description: "",
        remarks: "",
        requirement: "",
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit({
            proposalId,
            tenantUserId,
            clientUserId: Number(form.clientUserId),
            meetingDate: new Date(form.meetingDate).toISOString(),
            title: form.title,
            description: form.description,
            remarks: form.remarks,
            requirement: form.requirement,
        });
        if (success) onClose();
    };

    return (
        <Modal title="Add Discussion" onClose={onClose} width={640}>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-text-primary">Title</label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={handleChange("title")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Meeting Date</label>
                    <input
                        type="datetime-local"
                        required
                        value={form.meetingDate}
                        onChange={handleChange("meetingDate")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Client User</label>
                    <select
                        required
                        disabled={loadingMembers}
                        value={form.clientUserId}
                        onChange={handleChange("clientUserId")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <option value="" disabled>
                            {loadingMembers ? "Loading..." : "Select client user"}
                        </option>
                        {members.map((member) => (
                            <option key={member.id} value={member.id}>
                                {[member.firstname, member.lastname].filter(Boolean).join(" ") || member.email}
                                {member.email ? ` (${member.email})` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                {DISCUSSION_TEXTAREAS.map(({ label, key, required }) => (
                    <div key={key} className="col-span-2">
                        <label className="mb-1 block text-sm font-medium text-text-primary">{label}</label>
                        <textarea
                            rows={3}
                            required={required}
                            value={form[key]}
                            onChange={handleChange(key)}
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                        />
                    </div>
                ))}

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

export default function ProposalDiscussion() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { user } = useAuth();
    console.log("user",user)
    const { proposal, loading, savingDiscussion, addDiscussion } = useProposal(
        id,
        location.state?.proposal ?? null
    );
    const [discussionModal, setDiscussionModal] = useState(false);

    const discussions = [...(proposal?.proposalDiscussion ?? [])].sort(
        (a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)
    );

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
                <LuArrowLeft className="h-4 w-4" />
                Back
            </button>

            <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-text-primary">{proposal?.title || "Proposal"}</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        {proposal?.proposalNumber || `Proposal ID: ${id}`}
                    </p>
                </div>
                <Button className="!w-auto px-4">Convert to Contract</Button>
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-text-secondary">Loading proposal...</p>
            ) : !proposal ? (
                <p className="mt-6 text-sm text-text-secondary">Proposal not found.</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-border lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <h2 className="text-sm font-semibold text-text-primary">Discussion</h2>
                            <span className="text-xs text-text-secondary">{discussions.length} entries</span>
                        </div>

                        {discussions.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-text-secondary">
                                No discussion recorded for this proposal.
                            </p>
                        ) : (
                            <ol className="flex flex-col px-4 py-5">
                                {discussions.map((entry, idx) => (
                                    <li key={entry.id} className="relative pb-6 pl-8 last:pb-0">
                                        {idx !== discussions.length - 1 && (
                                            <span className="absolute bottom-0 left-[7px] top-5 w-px bg-border" />
                                        )}
                                        <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-surface" />

                                        <span className="flex items-center gap-1.5 text-xs font-medium text-primary-text">
                                            <LuCalendar className="h-3.5 w-3.5" />
                                            {formatDate(entry.meetingDate)}
                                        </span>

                                        <div className="mt-2 rounded-lg border border-border p-4">
                                            <p className="text-sm font-semibold text-text-primary">
                                                {entry.title || "-"}
                                            </p>

                                            <div className="mt-3 flex flex-col gap-2.5">
                                                {DISCUSSION_FIELDS.map(({ label, key }) => (
                                                    <div key={key}>
                                                        <p className="text-xs text-text-secondary">{label}</p>
                                                        <p className="mt-0.5 text-sm text-text-primary">
                                                            {entry[key] || "-"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3 text-xs text-text-secondary">
                                                <span>Tenant User ID : {entry.tenantUserId ?? "-"}</span>
                                                <span>Client User ID : {entry.clientUserId ?? "-"}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}

                        <div className="flex justify-end border-t border-border px-4 py-3">
                            <Button
                                className="!w-auto flex items-center gap-2 !py-2 px-4"
                                onClick={() => setDiscussionModal(true)}
                            >
                                <LuPlus className="h-4 w-4" />
                                Add Discussion
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border p-4">
                        <h2 className="text-sm font-semibold text-text-primary">Proposal Details</h2>

                        <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-text-secondary">Proposal No</dt>
                                <dd className="font-medium text-text-primary">{proposal.proposalNumber || "-"}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-text-secondary">Client</dt>
                                <dd className="font-medium text-text-primary">{proposal.clientName || "-"}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-text-secondary">Tenant</dt>
                                <dd className="font-medium text-text-primary">{proposal.tenantName || "-"}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-text-secondary">Status</dt>
                                <dd className="font-medium text-text-primary">{proposal.status || "-"}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <dt className="text-text-secondary">Start Date</dt>
                                <dd className="font-medium text-text-primary">
                                    {formatDate(proposal.proposalStartDate)}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-4 border-t border-border pt-3">
                            <p className="text-xs text-text-secondary">Description</p>
                            <p className="mt-0.5 text-sm text-text-primary">{proposal.description || "-"}</p>
                        </div>
                    </div>
                </div>
            )}

            {discussionModal && (
                <DiscussionFormModal
                    proposalId={id}
                    clientId={proposal?.clientId}
                    tenantUserId={user?.id}
                    clientUserId={proposal?.clientUserId}
                    saving={savingDiscussion}
                    onClose={() => setDiscussionModal(false)}
                    onSubmit={addDiscussion}
                />
            )}
        </div>
    );
}
