import { useState } from "react";
import { LuFile, LuX } from "react-icons/lu";
import FileUpload from "../../common/FileUpload/FileUpload";

export default function UploadDocument() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [error, setError] = useState("");

    const handleUploadComplete = ({ objectKey, file }) => {
        setError("");
        setUploadedFiles((prev) => [
            ...prev,
            { id: `${objectKey}-${prev.length}`, objectKey, name: file.name, size: file.size },
        ]);
    };

    const removeFile = (id) => {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <div>
            <h1 className="text-xl font-semibold text-text-primary">Upload Document</h1>
            <p className="mt-1 text-sm text-text-secondary">
                Test page for the presigned file upload flow
            </p>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row">
                <div className="max-w-md flex-1 rounded-xl border border-border p-4">
                    <FileUpload
                        label="Document"
                        id="document-upload"
                        onUploadComplete={handleUploadComplete}
                        onUploadError={(err) =>
                            setError(err?.response?.data?.message || err?.message || "Upload failed")
                        }
                    />
                </div>

                <div className="max-w-sm flex-1 rounded-xl border border-border p-4">
                    <h2 className="text-sm font-semibold text-text-primary">
                        Uploaded files ({uploadedFiles.length})
                    </h2>

                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                    {uploadedFiles.length === 0 && !error && (
                        <p className="mt-3 text-sm text-text-secondary">No files uploaded yet</p>
                    )}

                    <div className="mt-3 flex flex-col gap-2">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                            >
                                <span className="flex min-w-0 items-center gap-2">
                                    <LuFile className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
                                    <span className="truncate text-text-primary">{file.name}</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(file.id)}
                                    aria-label={`Remove ${file.name}`}
                                    className="shrink-0 text-text-secondary hover:text-red-600"
                                >
                                    <LuX className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
