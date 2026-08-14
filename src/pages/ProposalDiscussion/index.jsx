import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuPaperclip, LuSend } from "react-icons/lu";
import Button from "../../common/Button/Button";

const DUMMY_PROPOSAL = {
    id: "dummy-proposal-1",
    title: "Website Revamp - Phase 1",
    clientName: "Flipkart Internal Tools",
    amount: "₹4,50,000",
    status: "DRAFT",
    createdAt: "2026-08-01",
    description:
        "Redesign and rebuild the internal vendor management portal with a new UI, role-based access, and reporting dashboards.",
};

const DUMMY_ATTACHMENTS = [
    { name: "proposal-scope.pdf", size: "1.2 MB" },
    { name: "cost-breakdown.xlsx", size: "480 KB" },
];

const DUMMY_DISCUSSION = [
    {
        id: 1,
        author: "Sagar Kature",
        role: "Account Manager",
        message: "Sharing the initial proposal for the vendor portal revamp. Let us know your thoughts on scope and timeline.",
        timestamp: "2026-08-01 10:15 AM",
    },
    {
        id: 2,
        author: "Client (Flipkart)",
        role: "Stakeholder",
        message: "Looks good overall. Can we get a breakdown of the reporting dashboard effort separately?",
        timestamp: "2026-08-02 03:40 PM",
    },
    {
        id: 3,
        author: "Sagar Kature",
        role: "Account Manager",
        message: "Sure, updated the cost breakdown sheet with a separate line item for the dashboards.",
        timestamp: "2026-08-03 11:05 AM",
    },
    {
        id: 4,
        author: "Client (Flipkart)",
        role: "Stakeholder",
        message: "Perfect, this works for us. Please proceed with drafting the contract.",
        timestamp: "2026-08-04 09:20 AM",
    },
];

export default function ProposalDiscussion() {
    const navigate = useNavigate();
    const { id } = useParams();

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
                    <h1 className="text-xl font-semibold text-text-primary">{DUMMY_PROPOSAL.title}</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Proposal ID: {id || DUMMY_PROPOSAL.id}
                    </p>
                </div>
                <Button className="!w-auto px-4">Convert to Contract</Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-border">
                    <div className="border-b border-border px-4 py-3">
                        <h2 className="text-sm font-semibold text-text-primary">Discussion</h2>
                    </div>

                    <div className="flex flex-col gap-4 px-4 py-4">
                        {DUMMY_DISCUSSION.map((entry) => (
                            <div key={entry.id} className="rounded-lg bg-primary-light/40 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-text-primary">
                                        {entry.author}
                                        <span className="ml-2 text-xs font-normal text-text-secondary">
                                            {entry.role}
                                        </span>
                                    </span>
                                    <span className="text-xs text-text-secondary">{entry.timestamp}</span>
                                </div>
                                <p className="mt-1.5 text-sm text-text-secondary">{entry.message}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                disabled
                                placeholder="Add a comment (coming soon)"
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            <button
                                type="button"
                                disabled
                                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <LuSend className="h-3.5 w-3.5" />
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-border p-4">
                        <h2 className="text-sm font-semibold text-text-primary">Proposal Details</h2>

                        <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-text-secondary">Client</dt>
                                <dd className="font-medium text-text-primary">{DUMMY_PROPOSAL.clientName}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-text-secondary">Amount</dt>
                                <dd className="font-medium text-text-primary">{DUMMY_PROPOSAL.amount}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-text-secondary">Status</dt>
                                <dd className="font-medium text-text-primary">{DUMMY_PROPOSAL.status}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-text-secondary">Created</dt>
                                <dd className="font-medium text-text-primary">{DUMMY_PROPOSAL.createdAt}</dd>
                            </div>
                        </dl>

                        <p className="mt-3 text-sm text-text-secondary">{DUMMY_PROPOSAL.description}</p>
                    </div>

                    <div className="rounded-xl border border-border p-4">
                        <h2 className="text-sm font-semibold text-text-primary">Attachments</h2>

                        <div className="mt-3 flex flex-col gap-2">
                            {DUMMY_ATTACHMENTS.map((file) => (
                                <div
                                    key={file.name}
                                    className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                                >
                                    <span className="flex items-center gap-2 truncate text-text-primary">
                                        <LuPaperclip className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
                                        {file.name}
                                    </span>
                                    <span className="shrink-0 text-xs text-text-secondary">{file.size}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
