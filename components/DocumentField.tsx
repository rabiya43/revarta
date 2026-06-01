"use client";

import { FileUp, Type } from "lucide-react";
import { useRef, useState } from "react";

type Mode = "paste" | "upload";

type DocumentFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
};

export function DocumentField({
  label,
  value,
  onChange,
  placeholder,
  rows = 7,
}: DocumentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("paste");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function onFileSelected(file: File) {
    setUploading(true);
    setUploadError(null);
    setFileName(file.name);

    try {
      let text: string;
      const isPlain =
        file.type === "text/plain" || /\.(txt|md)$/i.test(file.name);

      if (isPlain) {
        text = await file.text();
      } else {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/extract-text", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not read file");
        text = data.text as string;
      }

      onChange(text.trim());
      setMode("paste");
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-ink-700">{label}</span>
        <div className="flex rounded-xl border-2 border-ink-100 p-0.5">
          <button
            type="button"
            onClick={() => setMode("paste")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mode === "paste" ? "bg-violet-500 text-white" : "text-ink-500 hover:bg-ink-50"
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            Paste
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mode === "upload" ? "bg-violet-500 text-white" : "text-ink-500 hover:bg-ink-50"
            }`}
          >
            <FileUp className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>
      </div>

      {mode === "paste" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-2xl border-2 border-ink-100 p-4 text-sm focus:border-violet-400 focus:outline-none"
          placeholder={placeholder}
        />
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink-100 bg-ink-50/50 p-6 text-center">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFileSelected(file);
              e.target.value = "";
            }}
          />
          <p className="mb-3 text-sm text-ink-500">PDF, Word (.docx), or plain text</p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="btn-secondary text-sm"
          >
            {uploading ? "Reading file…" : "Choose file"}
          </button>
          {fileName && !uploading ? (
            <p className="mt-2 text-xs text-ink-400">Last file: {fileName}</p>
          ) : null}
          {value.length > 0 ? (
            <p className="mt-2 text-xs font-medium text-mint-600">
              {value.length.toLocaleString()} characters loaded — switch to Paste to edit
            </p>
          ) : null}
        </div>
      )}

      {uploadError ? <p className="mt-2 text-sm text-coral-600">{uploadError}</p> : null}
    </div>
  );
}
