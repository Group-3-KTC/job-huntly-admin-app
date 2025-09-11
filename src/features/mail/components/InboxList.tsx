import { EnvelopeSimple, ArrowClockwise, ChatsCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { fetchTickets } from "../services/mailApi";
import type { InboxItemDto, TicketStatus } from "../../../types/mail.type.ts";
import StatusDropdown from "./StatusDropdown";

const cls = (...xs: (string | false | undefined | null)[]) => xs.filter(Boolean).join(" ");
const fmtTime = (iso?: string | null) => iso ? new Date(iso).toLocaleString() : "";
const stripHtml = (html?: string | null) =>
    html ? html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .trim() : "";

export default function InboxList({
                                      onSelect,
                                      selectedId,
                                      refreshKey,
                                      autoRefreshMs = 30_000,
                                  }: {
    onSelect: (t: InboxItemDto) => void;
    selectedId?: number | null;
    refreshKey: number;
    autoRefreshMs?: number;
}) {
    const [status, setStatus] = useState<TicketStatus>("OPEN");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(0);
    const [data, setData] = useState<{
        content: InboxItemDto[];
        number: number;
        totalPages: number;
        first: boolean;
        last: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [localRefreshCount, setLocalRefreshCount] = useState(0);

    const combinedRefreshKey = refreshKey + localRefreshCount;

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setErr(null);
        fetchTickets({ status, q: q || undefined, page, size: 20, sort: "createdAt,DESC" })
            .then(res => {
                if (!mounted) return;
                setData(res);
                if (res.content.length > 0 && !selectedId) {
                    onSelect(res.content[0]);
                }
            })
            .catch(e => setErr(e?.response?.data?.message || e.message))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [status, q, page, combinedRefreshKey]); // eslint-disable-line

    useEffect(() => {
        if (!autoRefreshMs || autoRefreshMs < 1000) return;

        const tick = () => {
            if (document.hidden) return;
            setLocalRefreshCount(k => k + 1);
        };

        const id = window.setInterval(tick, autoRefreshMs);

        const onVisible = () => {
            if (!document.hidden) tick();
        };
        document.addEventListener("visibilitychange", onVisible);

        tick();

        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [autoRefreshMs]);


    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <EnvelopeSimple size={24} />
                <h2 className="text-lg font-semibold">Inbox</h2>
                <button
                    onClick={() => setLocalRefreshCount(k => k + 1)}
                    className="ml-auto inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border hover:bg-gray-50"
                    title="Làm mới"
                >
                    <ArrowClockwise size={16} /> Refresh
                </button>
            </div>

            <div className="px-4 py-2 flex gap-2 items-center">
                <div className="relative flex-1">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm theo subject..."
                        className="w-full pl-3 pr-3 py-2 border rounded-xl focus:outline-none focus:ring"
                    />
                </div>
                <StatusDropdown value={status} onChange={(s) => { setStatus(s); setPage(0); }} />
            </div>

            <div className="flex-1 overflow-auto">
                {loading && <ListSkeleton />}
                {err && <div className="m-3 p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm">{err}</div>}
                {!loading && data && data.content.length === 0 && <EmptyState />}

                <ul className="divide-y">
                    {data?.content.map((t) => (
                        <li key={t.id}>
                            <button
                                onClick={() => onSelect(t)}
                                className={cls(
                                    "w-full text-left px-4 py-3 hover:bg-gray-50",
                                    selectedId === t.id && "bg-indigo-50"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <ChatsCircle size={22} className="text-indigo-500" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate">{t.subject || "(no subject)"}</p>
                                            <span className={cls(
                                                "text-xxs px-2 py-0.5 rounded-full border",
                                                t.status === "OPEN" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                                t.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                                                t.status === "CLOSED" && "bg-gray-100 text-gray-700 border-gray-200",
                                            )}>{t.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{t.lastSnippet || stripHtml(t.subject)}</p>
                                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                            <span title={t.lastFrom || ""}>{t.lastFrom || t.customerEmail || ""}</span>
                                            <span>•</span>
                                            <span>{fmtTime(t.lastMessageAt || t.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-3 border-t border-gray-100 flex items-center justify-between text-sm">
                <div>Page {data ? data.number + 1 : 0}/{data?.totalPages ?? 0}</div>
                <div className="flex gap-2">
                    <button
                        disabled={!data || data.first}
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={!data || data.last}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1.5 rounded-lg border disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

function ListSkeleton() {
    return (
        <ul className="divide-y animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="px-4 py-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </li>
            ))}
        </ul>
    );
}
function EmptyState() {
    return <div className="p-8 text-center text-gray-500">No tickets yet.</div>;
}
