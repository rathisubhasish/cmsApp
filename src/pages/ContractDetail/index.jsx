import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuCalendar, LuExternalLink } from "react-icons/lu";
import Loader from "../../common/Loader/Loader";
import Timeline, { TimelineItem } from "../../common/Timeline/Timeline";
import { useContract, contractId } from "../../hooks/useContracts";
import { formatDate, humanize } from "../../services/utility";

const TENANT_FIELDS = [
    { label: "Legal Name", key: "legalName" },
    { label: "Email", key: "email" },
    { label: "Mobile", key: "mobile" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Pincode", key: "pinCode" },
    { label: "Country", key: "country" },
    { label: "Address", key: "address", span: true },
];

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <dt className="text-text-secondary">{label}</dt>
            <dd className="text-right font-medium text-text-primary">{value}</dd>
        </div>
    );
}

export default function ContractDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { contract, loading } = useContract(id, location.state?.contract ?? null);

    const proposal = contract?.proposal;
    const tenant = contract?.tenant;
    const discussions = [...(proposal?.proposalDiscussion ?? [])].sort(
        (a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)
    );
    const timeline = [...(contract?.timeLine ?? [])].sort(
        (a, b) => new Date(a.actionAt) - new Date(b.actionAt)
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

            <div className="mt-4">
                <h1 className="text-xl font-semibold text-text-primary">
                    {contract?.contractTitle || "Contract"}
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                    {contract ? `Contract ID: ${contractId(contract)}` : `Contract ID: ${id}`}
                </p>
            </div>

            {loading ? (
                <Loader label="Loading contract..." />
            ) : !contract ? (
                <p className="mt-6 text-sm text-text-secondary">Contract not found.</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div className="rounded-xl border border-border p-4">
                            <h2 className="text-sm font-semibold text-text-primary">Contract</h2>
                            <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                                <Row label="Title" value={contract.contractTitle || "-"} />
                                <Row label="Status" value={humanize(contract.status)} />
                                <Row label="Contract Type" value={humanize(contract.contractType)} />
                                <Row label="Billing Type" value={humanize(contract.billingType)} />
                            </dl>
                        </div>

                        <div className="rounded-xl border border-border p-4">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold text-text-primary">Linked Proposal</h2>
                                {proposal && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/proposal-discussion/${proposal.id}`, { state: { proposal } })
                                        }
                                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-primary-light"
                                    >
                                        <LuExternalLink className="h-3.5 w-3.5" />
                                        Open Proposal
                                    </button>
                                )}
                            </div>

                            {!proposal ? (
                                <p className="mt-3 text-sm text-text-secondary">No proposal linked.</p>
                            ) : (
                                <>
                                    <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                                        <Row label="Proposal No" value={proposal.proposalNumber || "-"} />
                                        <Row label="Title" value={proposal.title || "-"} />
                                        <Row label="Client" value={proposal.clientName || "-"} />
                                        <Row label="Status" value={humanize(proposal.status)} />
                                        <Row label="Start Date" value={formatDate(proposal.proposalStartDate)} />
                                    </dl>

                                    <div className="mt-4 border-t border-border pt-3">
                                        <p className="text-xs text-text-secondary">Description</p>
                                        <p className="mt-0.5 text-sm text-text-primary">
                                            {proposal.description || "-"}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="rounded-xl border border-border">
                            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                <h2 className="text-sm font-semibold text-text-primary">Discussion</h2>
                                <span className="text-xs text-text-secondary">{discussions.length} entries</span>
                            </div>

                            {discussions.length === 0 ? (
                                <p className="px-4 py-6 text-center text-sm text-text-secondary">
                                    No discussion recorded for the linked proposal.
                                </p>
                            ) : (
                                <Timeline className="px-4 py-5">
                                    {discussions.map((entry, idx) => (
                                        <TimelineItem
                                            key={entry.id}
                                            last={idx === discussions.length - 1}
                                            marker={
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-primary-text">
                                                    <LuCalendar className="h-3.5 w-3.5" />
                                                    {formatDate(entry.meetingDate, true)}
                                                </span>
                                            }
                                        >
                                            <div className="mt-2 rounded-lg border border-border p-4">
                                                <p className="text-sm font-semibold text-text-primary">
                                                    {entry.title || "-"}
                                                </p>
                                                <p className="mt-2 text-sm text-text-primary">
                                                    {entry.description || "-"}
                                                </p>
                                            </div>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="rounded-xl border border-border">
                            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                <h2 className="text-sm font-semibold text-text-primary">Contract Timeline</h2>
                                <span className="text-xs text-text-secondary">{timeline.length} events</span>
                            </div>

                            {timeline.length === 0 ? (
                                <p className="px-4 py-6 text-center text-sm text-text-secondary">
                                    No timeline events yet.
                                </p>
                            ) : (
                                <Timeline className="px-4 py-5">
                                    {timeline.map((entry, idx) => (
                                        <TimelineItem
                                            key={`${entry.action}-${entry.actionAt}-${idx}`}
                                            last={idx === timeline.length - 1}
                                            marker={
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-primary-text">
                                                    <LuCalendar className="h-3.5 w-3.5" />
                                                    {formatDate(entry.actionAt, true)}
                                                </span>
                                            }
                                        >
                                            <div className="mt-2 rounded-lg border border-border p-3">
                                                <p className="text-sm font-semibold text-text-primary">
                                                    {humanize(entry.action)}
                                                </p>
                                                <p className="mt-1 text-xs text-text-secondary">
                                                    {entry.actionByName || "-"}
                                                </p>
                                                {entry.actionByEmail && (
                                                    <p className="truncate text-xs text-text-secondary">
                                                        {entry.actionByEmail}
                                                    </p>
                                                )}
                                                {entry.comment && entry.comment !== "-" && (
                                                    <p className="mt-2 text-sm text-text-primary">{entry.comment}</p>
                                                )}
                                            </div>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            )}
                        </div>

                        <div className="rounded-xl border border-border p-4">
                            <h2 className="text-sm font-semibold text-text-primary">Tenant</h2>

                        {!tenant ? (
                            <p className="mt-3 text-sm text-text-secondary">No tenant details.</p>
                        ) : (
                            <>
                                <div className="mt-3 flex items-center gap-3">
                                    {tenant.logoUrl ? (
                                        <img
                                            src={tenant.logoUrl}
                                            alt={tenant.name || "Tenant logo"}
                                            className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-text">
                                            {(tenant.name ?? "?").charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-text-primary">
                                            {tenant.name || "-"}
                                        </p>
                                        <p className="text-xs text-text-secondary">
                                            {tenant.verified ? "Verified" : "Not verified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                                    {TENANT_FIELDS.map(({ label, key, span }) => (
                                        <div key={key} className={span ? "col-span-2" : undefined}>
                                            <p className="text-xs text-text-secondary">{label}</p>
                                            <p className="mt-0.5 text-sm font-medium text-text-primary">
                                                {tenant[key] || "-"}
                                            </p>
                                        </div>
                                    ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
