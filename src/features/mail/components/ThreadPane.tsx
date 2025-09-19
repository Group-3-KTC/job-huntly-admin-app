import { useEffect, useMemo, useRef, useState } from "react";
import type { InboxItemDto, MessageDto, ReplyRequest, ReplyResultDto } from "../../../types/mail.type.ts";
import {fetchMessages, replyTicket, updateTicketStatus} from "../services/mailApi";
import MessageBubble from "./MessageBubble";
import { CheckCircle, EnvelopeSimple, PaperPlaneRight, XCircle } from "phosphor-react";
import {AxiosError} from "axios";
import StatusDropdown from "./StatusDropdown.tsx";

const cls = (...xs: (string | false | undefined | null)[]) => xs.filter(Boolean).join(" ");
const fmtTime = (iso?: string | null) => iso ? new Date(iso).toLocaleString() : "";
const stripHtml = (html?: string | null) =>
    html ? html
        .replace(/<style.*?>[\s\S]*?<\/style>/gi, " ")
        .replace(/<script.*?>[\s\S]*?<\/script>/gi, " ")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\u00A0/g, " ")
        .trim() : "";

export default function ThreadPane({
                                       selected,
                                       onReplied,
                                       autoRefreshMs = 15_000,
                                   }: {
                                        selected: InboxItemDto | null;
                                        onReplied: () => void
                                        autoRefreshMs?: number;
                                   }) {
    const [data, setData] = useState<{ content: MessageDto[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [, setChangingStatus] = useState(false);

    const changeStatus = async (status: "OPEN"|"PENDING"|"CLOSED") => {
        if (!selected?.id) return;
        try {
            setChangingStatus(true);
            await updateTicketStatus(selected.id, status);
            onReplied();
            setToast({ ok: true, msg: `Status changed to ${status}.` });
            setTimeout(() => setToast(null), 1500);
        } catch (e) {
            setToast({ ok: false, msg: "Failed to change status" });
        } finally {
            setChangingStatus(false);
        }
    };

    // load messages
    useEffect(() => {
        let mounted = true;
        if (!selected?.id) return setData(null);
        setLoading(true);
        setError(null);
        fetchMessages(selected.id, 0, 500)
            .then(res => mounted && setData(res))
            .catch(e => setError(e?.response?.data?.message || e.message))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [selected?.id]);

    useEffect(() => {
        if (!selected?.id) return;
        if (!autoRefreshMs || autoRefreshMs < 1000) return;

        let disposed = false;
        const refetch = async () => {
            if (disposed) return;
            if (document.hidden) return;
            try {
                const res = await fetchMessages(selected.id, 0, 500);
                if (!disposed) setData(res);
            } catch { /* ignore tick errors */ }
        };

        const id = window.setInterval(refetch, autoRefreshMs);
        const onVisible = () => { if (!document.hidden) refetch(); };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            disposed = true;
            window.clearInterval(id);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [selected?.id, autoRefreshMs]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.content.length]);

    const lastInbound = useMemo(() => {
        if (!data) return null;
        const items = [...data.content].reverse();
        return items.find(m => m.direction === "INBOUND") || null;
    }, [data]);

    const submit = async () => {
        if (!selected?.id || !reply.trim()) return;
        try {
            setSending(true);
            const payload: ReplyRequest = {
                bodyHtml: `<p>${reply.replace(/\n/g, "<br/>")}</p>`,
                replyToMessageId: lastInbound?.messageId || undefined,
            };
            const res: ReplyResultDto = await replyTicket(selected.id, payload);

            const appended: MessageDto = {
                id: res.ticketMessageId,
                ticketId: res.ticketId,
                messageId: res.messageId,
                inReplyTo: lastInbound?.messageId || null,
                fromEmail: "me",
                sentAt: res.sentAt,
                direction: "OUTBOUND",
                bodyHtml: payload.bodyHtml,
                bodyText: stripHtml(payload.bodyHtml),
            };
            setData(old => old ? { ...old, content: [...old.content, appended] } : old);
            setReply("");
            setToast({ ok: true, msg: "Reply sent successfully." });

            try { await updateTicketStatus(selected.id, "PENDING"); } catch {}

            onReplied();
            setTimeout(() => setToast(null), 2000);
        } catch (e) {
            let msg = "Failed to send";

            if (e instanceof AxiosError) {
                msg = e.response?.data?.message || e.message || msg;
            } else if (e instanceof Error) {
                msg = e.message;
            }

            setToast({ ok: false, msg });
        } finally {
            setSending(false);
        }
    };

    if (!selected) {
        return (
            <div className="flex-1 grid place-items-center text-gray-500">
                <div className="text-center">
                    <EnvelopeSimple size={40} className="mx-auto mb-2" />
                    <p>Select a mail to view</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{uiSubject(selected.subject)}</h3>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span>{selected.customerEmail || selected.lastFrom || ""}</span>
                        <span>•</span>
                        <span>{fmtTime(selected.lastMessageAt || selected.createdAt)}</span>
                    </div>
                </div>
                <StatusDropdown
                    value={selected.status}
                    onChange={(s) => changeStatus(s)}
                />
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
                {loading && <div className="text-gray-500">Loading mail…</div>}
                {error && <div className="m-3 p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm">{error}</div>}
                {data?.content.map((m) => (
                    <MessageBubble key={m.id} msg={m} me={m.direction === "OUTBOUND"} />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-gray-100">
                <div className="flex items-end gap-2">
          <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enter your reply…"
              className="flex-1 border rounded-xl p-3 min-h-[80px] focus:outline-none focus:ring"
          />
                    <button
                        onClick={submit}
                        disabled={!reply.trim() || sending}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 shadow"
                    >
                        <PaperPlaneRight size={18} /> Send
                    </button>
                </div>
                {toast && (
                    <div className={cls(
                        "mt-2 text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
                        toast.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    )}>
                        {toast.ok ? <CheckCircle size={18} /> : <XCircle size={18} />} {toast.msg}
                    </div>
                )}
            </div>
        </div>
    );
}

function uiSubject(s?: string | null) {
    if (!s) return "(no subject)";
    let out = s.trim();
    while (/^(re|fwd?|fw)\s*:/i.test(out)) out = out.replace(/^(re|fwd?|fw)\s*:/i, "").trim();
    return out || "(no subject)";
}