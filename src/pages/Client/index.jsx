import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { LuSearch, LuPlus, LuLayoutGrid, LuTable, LuEye, LuPencil, LuTrash2, LuEllipsisVertical } from "react-icons/lu";
import Button from "../../common/Button/Button";
import Loader from "../../common/Loader/Loader";
import Modal from "../../Modal";
import { useAuth } from "../../context/AuthContext";
import { useClients } from "../../hooks/useClients";

const COLUMNS = ["Logo", "Name", "Mobile", "Email", "Address", "City", "State", "Pincode", "Country", "Actions"];

const FORM = {
    name: "",
    email: "",
    mobile: "",
    pan: "",
    gst: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
};

function ClientActionsMenu({ client, onView, onEdit, onDelete, deleting }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const closeTimer = useRef(null);

    const openMenu = () => {
        clearTimeout(closeTimer.current);
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 4, left: rect.right - 128 });
        setOpen(true);
    };

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 150);
    };

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                aria-label="Client actions"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-light hover:text-text-primary"
            >
                <LuEllipsisVertical className="h-4 w-4" />
            </button>

            {open &&
                createPortal(
                    <div
                        style={{ position: "fixed", top: coords.top, left: coords.left, width: 128 }}
                        onMouseEnter={openMenu}
                        onMouseLeave={scheduleClose}
                        className="z-50 flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onView(client);
                            }}
                            className="flex items-center gap-2 whitespace-nowrap px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary-light"
                        >
                            <LuEye className="h-3.5 w-3.5" />
                            View
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onEdit(client);
                            }}
                            className="flex items-center gap-2 whitespace-nowrap border-t border-border px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary-light"
                        >
                            <LuPencil className="h-3.5 w-3.5" />
                            Edit
                        </button>
                        <button
                            type="button"
                            disabled={deleting}
                            onClick={() => {
                                setOpen(false);
                                onDelete(client);
                            }}
                            className="flex items-center gap-2 whitespace-nowrap border-t border-border px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <LuTrash2 className="h-3.5 w-3.5" />
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>,
                    document.body
                )}
        </>
    );
}

export default function Client() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const tenantId = user?.tenantId;
    const { clients, loading, saving, addClient, updateClient, deleteClient, deletingId } = useClients(tenantId);

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("table");
    const [clientModal, setClientModal] = useState(false);
    const [clientForm, setClientForm] = useState(FORM);
    const [editingClient, setEditingClient] = useState(null);

    const filteredClients = clients.filter((client) =>
        (client.name ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const handleFieldChange = (field) => (e) => {
        setClientForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const closeClientModal = () => {
        setClientModal(false);
        setClientForm(FORM);
        setEditingClient(null);
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setClientForm({ ...FORM, ...client });
        setClientModal(true);
    };

    const openClientDetail = (client) => {
        navigate(`/client/${client.id}`, { state: { client } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = editingClient
            ? await updateClient(editingClient.id, clientForm)
            : await addClient(clientForm);
        if (success) closeClientModal();
    };

    const handleDelete = async (client) => {
        if (!window.confirm(`Delete client "${client.name}"? This cannot be undone.`)) return;
        await deleteClient(client.id);
    };

    return (
        <div>
            <h1 className="text-xl font-semibold text-text-primary">Clients</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage all clients in your workspace</p>

            <div className="mt-6 flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search clients"
                        className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:border-primary"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <span className="whitespace-nowrap text-sm text-text-secondary">
                        {filteredClients.length} Clients
                    </span>
                    <button
                        type="button"
                        onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
                        className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-primary-light"
                    >
                        {viewMode === "table" ? <LuLayoutGrid className="h-4 w-4" /> : <LuTable className="h-4 w-4" />}
                        {viewMode === "table" ? "Card View" : "Table View"}
                    </button>
                    <Button className="!w-auto flex items-center gap-2 !py-2 px-4" onClick={()=>setClientModal(true)}>
                        <LuPlus className="h-4 w-4" />
                        Add Client
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="mt-6 rounded-xl border border-border">
                    <Loader label="Loading clients..." />
                </div>
            ) : viewMode === "table" ? (
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
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="border-b border-border last:border-b-0">
                                    <td className="px-4 py-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-text">
                                            {(client.name ?? "?").charAt(0)}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-primary">{client.name || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.mobile || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.email || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.address || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.city || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.state || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.pincode || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-text-secondary">{client.country || "-"}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <ClientActionsMenu
                                            client={client}
                                            onView={openClientDetail}
                                            onEdit={openEditModal}
                                            onDelete={handleDelete}
                                            deleting={deletingId === client.id}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={COLUMNS.length} className="px-4 py-6 text-center text-sm text-text-secondary">
                                        No clients found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                    {filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="rounded-xl border border-border bg-surface p-5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-text">
                                    {(client.name ?? "?").charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-text-primary">{client.name || "-"}</p>
                                    <p className="truncate text-sm text-text-secondary">{client.email || "-"}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-1 text-sm">
                                <p>
                                    <span className="font-medium text-primary-text">City</span>{" "}
                                    <span className="text-text-secondary">- {client.city || "-"}</span>
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                                <span className="text-xs text-text-secondary">{client.joinedAgo || "-"}</span>
                                <ClientActionsMenu
                                    client={client}
                                    onView={openClientDetail}
                                    onEdit={openEditModal}
                                    onDelete={handleDelete}
                                    deleting={deletingId === client.id}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {
                clientModal &&
                (
                    <Modal title={editingClient ? "Edit Client" : "Add Client"} onClose={closeClientModal} width={640}>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="mb-1 block text-sm font-medium text-text-primary">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={clientForm.name}
                                    onChange={handleFieldChange("name")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={clientForm.email}
                                    onChange={handleFieldChange("email")}
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
                                    value={clientForm.mobile}
                                    onChange={handleFieldChange("mobile")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">PAN</label>
                                <input
                                    type="text"
                                    required
                                    value={clientForm.pan}
                                    onChange={handleFieldChange("pan")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">GST</label>
                                <input
                                    type="text"
                                    required
                                    value={clientForm.gst}
                                    onChange={handleFieldChange("gst")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="mb-1 block text-sm font-medium text-text-primary">Address</label>
                                <input
                                    type="text"
                                    required
                                    value={clientForm.address}
                                    onChange={handleFieldChange("address")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">City</label>
                                <input
                                    type="text"
                                    value={clientForm.city}
                                    onChange={handleFieldChange("city")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">State</label>
                                <input
                                    type="text"
                                    value={clientForm.state}
                                    onChange={handleFieldChange("state")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">Pincode</label>
                                <input
                                    type="text"
                                    value={clientForm.pincode}
                                    onChange={handleFieldChange("pincode")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-text-primary">Country</label>
                                <input
                                    type="text"
                                    value={clientForm.country}
                                    onChange={handleFieldChange("country")}
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                />
                            </div>

                            <div className="col-span-2 mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeClientModal}
                                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-primary-light"
                                >
                                    Cancel
                                </button>
                                <Button type="submit" className="!w-auto px-4" loading={saving}>
                                    {editingClient ? "Update" : "Save"}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )
            }
        </div>
    );
}
