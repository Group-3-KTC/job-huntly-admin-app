import type { MessageDto } from "../../../types/mail.type.ts";

const cls = (...xs: (string | false | undefined | null)[]) => xs.filter(Boolean).join(" ");
const fmtTime = (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : "");

// Lọc quoted reply phổ biến (Gmail/Yahoo/Outlook) cho INBOUND
function stripQuotedHtml(html: string) {
    let s = html;
    s = s
        .replace(/<div[^>]+class="[^"]*gmail_attr[^"]*"[^>]*>[\s\S]*?$/i, "")
        .replace(/<div[^>]+class="[^"]*gmail_quote[^"]*"[^>]*>[\s\S]*?$/i, "")
        .replace(/<blockquote[^>]+class="[^"]*gmail_quote[^"]*"[^>]*>[\s\S]*?<\/blockquote>/gi, "")
        .replace(/<div[^>]+class="[^"]*gmail_extra[^"]*"[^>]*>[\s\S]*?$/i, "")
        .replace(/<div[^>]+class="[^"]*yahoo_quoted[^"]*"[^>]*>[\s\S]*?$/i, "")
        .replace(/<div[^>]+id="divRplyFwdMsg"[^>]*>[\s\S]*?$/i, "")
        .replace(/<blockquote[^>]*type="cite"[^>]*>[\s\S]*?<\/blockquote>/gi, "")
        .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, ""); // any leftover
    // drop trailing <br/>
    s = s.replace(/(<br\s*\/?>\s*)+$/i, "").trim();
    return s;
}

// -------- NEW: Attachment rendering --------
type RawAttachment = {
    id?: number;
    filename?: string | null;
    contentType?: string | null;
    content_type?: string | null;
    storageUrl?: string | null;
    storage_url?: string | null;
    inline?: boolean | number | null;
};

function normalizeAttachments(msg: any): { filename: string; contentType: string; url: string; inline: boolean }[] {
    const list: RawAttachment[] =
        (msg && (msg.attachments || msg.attachmentList || msg.attachmentDtos)) || [];
    return list
        .map((a) => {
            const filename = (a.filename ?? "file").toString();
            const contentType = (a.contentType ?? a.content_type ?? "application/octet-stream").toString();
            const url = (a.storageUrl ?? a.storage_url ?? "").toString();
            const inline = typeof a.inline === "number" ? a.inline === 1 : !!a.inline;
            return { filename, contentType, url, inline };
        })
        .filter((x) => !!x.url);
}

function AttachmentList({
                            html,
                            items,
                            me,
                        }: {
    html?: string | null;
    items: { filename: string; contentType: string; url: string; inline: boolean }[];
    me: boolean;
}) {
    if (!items || items.length === 0) return null;

    const htmlStr = html || "";
    const filtered = items.filter((it) => {
        if (!it.inline) return true;
        if (!/^image\//i.test(it.contentType)) return true;
        return !htmlStr.includes(it.url);
    });
    if (filtered.length === 0) return null;

    return (
        <div className={cls("mt-2 grid gap-2", me ? "text-white" : "text-gray-800")}
             aria-label="attachments">
            {filtered.map((att, idx) => {
                const isImg = /^image\//i.test(att.contentType);
                const isPdf = /^application\/pdf$/i.test(att.contentType);

                if (isImg) {
                    return (
                        <a
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className={cls(
                                "inline-flex items-center gap-2 rounded-lg border",
                                me ? "border-indigo-400 hover:bg-indigo-500/20" : "border-gray-200 hover:bg-gray-50"
                            )}
                            title={att.filename}
                        >
                            <img
                                src={att.url}
                                alt={att.filename || "image"}
                                className="w-28 h-28 object-cover rounded-l-lg"
                                loading="lazy"
                            />
                            <span className="px-3 py-2 text-sm truncate max-w-[220px]">{att.filename}</span>
                        </a>
                    );
                }

                if (isPdf) {
                    return (
                        <a
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className={cls(
                                "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
                                me ? "border-indigo-400 hover:bg-indigo-500/20" : "border-gray-200 hover:bg-gray-50"
                            )}
                            title={att.filename}
                        >
                            <PdfIcon />
                            <span className="text-sm truncate max-w-[280px]">{att.filename || "document.pdf"}</span>
                        </a>
                    );
                }

                // Other types
                return (
                    <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className={cls(
                            "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
                            me ? "border-indigo-400 hover:bg-indigo-500/20" : "border-gray-200 hover:bg-gray-50"
                        )}
                        title={att.filename}
                    >
                        <FileIcon />
                        <span className="text-sm truncate max-w-[280px]">{att.filename || "attachment"}</span>
                        <span className="text-xs opacity-70">{att.contentType}</span>
                    </a>
                );
            })}
        </div>
    );
}

function PdfIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
            <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12c1.1 0 2-.9 2-2V8z"/>
            <path fill="currentColor" d="M14 2v6h6"/>
            <path fill="currentColor" d="M7 15h2a1 1 0 1 0 0-2H7zM7 13V9h2a2 2 0 1 1 0 4zM12 9h2a2 2 0 1 1 0 4h-1v2h-1zM17 9h3v1h-2v1h2v1h-2v2h-1z"/>
        </svg>
    );
}
function FileIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
            <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12c1.1 0 2-.9 2-2V8z"/>
            <path fill="currentColor" d="M14 2v6h6"/>
        </svg>
    );
}

export default function MessageBubble({ msg, me }: { msg: MessageDto; me: boolean }) {
    const bodyHtml = msg.bodyHtml && !me ? stripQuotedHtml(msg.bodyHtml) : msg.bodyHtml;
    const atts = normalizeAttachments(msg);

    return (
        <div
            className={cls("max-w-[80%]", me ? "ml-auto" : "mr-auto")}
            title={`${msg.fromEmail} • ${fmtTime(msg.sentAt)}`}
        >
            <div
                className={cls(
                    "rounded-2xl px-4 py-3 shadow-sm border",
                    me ? "bg-indigo-600 text-white border-indigo-500" : "bg-white text-gray-900 border-gray-100"
                )}
            >
                {bodyHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                ) : (
                    <pre className="whitespace-pre-wrap font-sans">{msg.bodyText}</pre>
                )}

                {/* NEW: attachments */}
                <AttachmentList html={bodyHtml} items={atts} me={me} />
            </div>
            <div className={cls("mt-1 text-xs", me ? "text-indigo-800 text-right" : "text-gray-500")}>
                {fmtTime(msg.sentAt)}
            </div>
        </div>
    );
}
