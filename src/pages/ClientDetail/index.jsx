import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import Button from "../../common/Button/Button";
import InlineTab from "../../common/InlineTab/InlineTab";
import Loader from "../../common/Loader/Loader";
import Modal from "../../Modal";
import { useClient, useClientMembers } from "../../hooks/useClientDetail";

const DETAIL_FIELDS = [
    { label: "PAN", key: "pan" },
    { label: "GST", key: "gst" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Pincode", key: "pincode" },
    { label: "Country", key: "country" },
    { label: "Address", key: "address", span: true },
];

const MEMBER_COLUMNS = ["Name", "Email", "Mobile", "Status"];

const MEMBER_FORM = {
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    active: true,
};

const memberName = (member) => [member.firstname, member.lastname].filter(Boolean).join(" ") || "-";

function DetailsTab({ client }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-sm font-semibold text-text-primary">Contact Information</h3>
                <div className="rounded-xl bg-primary-light p-4">
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-text-primary">{client.name || "-"}</span>
                        <span className="whitespace-nowrap text-xs font-medium text-primary-text">
                            ID: {client.id}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">Email : {client.email || "-"}</p>
                    <p className="text-sm text-text-secondary">Mobile : {client.mobile || "-"}</p>
                </div>
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-text-primary">Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3">
                    {DETAIL_FIELDS.map(({ label, key, span }) => (
                        <div key={key} className={span ? "col-span-2 md:col-span-3" : undefined}>
                            <p className="text-xs text-text-secondary">{label}</p>
                            <p className="mt-0.5 text-sm font-medium text-text-primary">{client[key] || "-"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MemberFormModal({ saving, onClose, onSubmit }) {
    const [form, setForm] = useState(MEMBER_FORM);

    const handleChange = (field) => (e) => {
        const value = field === "active" ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(form);
        if (success) onClose();
    };

    return (
        <Modal title="Create Member" onClose={onClose} width={560}>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">First Name</label>
                    <input
                        type="text"
                        required
                        value={form.firstname}
                        onChange={handleChange("firstname")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Last Name</label>
                    <input
                        type="text"
                        required
                        value={form.lastname}
                        onChange={handleChange("lastname")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Email</label>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange("email")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-text-primary">Mobile</label>
                    <input
                        type="tel"
                        required
                        pattern="^\+?[0-9]{10,15}$"
                        title="Enter a valid mobile number (10-15 digits, optional +)"
                        value={form.mobile}
                        onChange={handleChange("mobile")}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <label className="col-span-2 flex items-center gap-2 text-sm font-medium text-text-primary">
                    <input
                        type="checkbox"
                        checked={form.active}
                        onChange={handleChange("active")}
                        className="h-4 w-4 accent-primary"
                    />
                    Active
                </label>

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

function MembersTab({ clientId }) {
    const { members, loading, error, saving, createMember } = useClientMembers(clientId);
    const [memberModal, setMemberModal] = useState(false);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-sm text-text-secondary">{members.length} Members</span>
                <Button
                    className="!w-auto flex items-center gap-2 !py-2 px-4"
                    onClick={() => setMemberModal(true)}
                >
                    <LuPlus className="h-4 w-4" />
                    Create Member
                </Button>
            </div>

            {loading ? (
                <Loader label="Loading members..." />
            ) : error ? (
                <p className="text-sm text-red-600">Failed to load client members.</p>
            ) : !members.length ? (
                <p className="text-sm text-text-secondary">No members found for this client.</p>
            ) : (
                <MembersTable members={members} />
            )}

            {memberModal && (
                <MemberFormModal
                    saving={saving}
                    onClose={() => setMemberModal(false)}
                    onSubmit={createMember}
                />
            )}
        </div>
    );
}

function MembersTable({ members }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                    <tr className="border-b border-border">
                        {MEMBER_COLUMNS.map((col) => (
                            <th key={col} className="whitespace-nowrap px-4 py-3 font-semibold text-primary-text">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, idx) => (
                        <tr key={member.id ?? idx} className="border-b border-border last:border-b-0">
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-text">
                                        {memberName(member).charAt(0)}
                                    </div>
                                    <span className="text-text-primary">{memberName(member)}</span>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{member.email || "-"}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{member.mobile || "-"}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={
                                        member.active
                                            ? "whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                                            : "whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                                    }
                                >
                                    {member.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ClientDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { clientId } = useParams();
    const { client, loading } = useClient(clientId, location.state?.client ?? null);
    const [activeTab, setActiveTab] = useState("details");

    const tabs = [
        { title: "Details", active: activeTab === "details", onClick: () => setActiveTab("details") },
        { title: "Client Members", active: activeTab === "members", onClick: () => setActiveTab("members") },
    ];

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
                <h1 className="text-xl font-semibold text-text-primary">{client?.name || "Client"}</h1>
                <p className="mt-1 text-sm text-text-secondary">{client?.email || `Client ID: ${clientId}`}</p>
            </div>

            <div className="mt-4 border-b border-border">
                <InlineTab tabs={tabs} />
            </div>

            <div className="mt-6">
                {activeTab === "details" ? (
                    loading ? (
                        <Loader label="Loading client..." />
                    ) : client ? (
                        <DetailsTab client={client} />
                    ) : (
                        <p className="text-sm text-text-secondary">Client not found.</p>
                    )
                ) : (
                    <MembersTab clientId={clientId} />
                )}
            </div>
        </div>
    );
}
