import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchMessages, fetchMoreTickets, fetchTickets, selectTicket, sendReply } from '../store/mailSlice';
import type { TicketSummary } from '../../../types/mail.type.ts';
import {useAppDispatch, useAppSelector} from "../../../hooks/useAppSelector.ts";

function formatDateTime(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function MailInboxPage() {
    const dispatch = useAppDispatch();
    const { items, loading, error, page, size, totalPages, selectedId, messagesByTicket, sending } =
        useAppSelector((state) => state.mail);

    const selectedTicket: TicketSummary | undefined = useMemo(
        () => items.find((t) => t.id === selectedId),
        [items, selectedId],
    );

    const [q, setQ] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const replyRef = useRef<HTMLTextAreaElement>(null);

    // load lần đầu
    useEffect(() => {
        dispatch(fetchTickets({ page: 0, size, q: q || undefined }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // auto chọn ticket đầu và nạp messages
    useEffect(() => {
        if (selectedTicket && !messagesByTicket[selectedTicket.id]) {
            dispatch(fetchMessages(selectedTicket.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTicket?.id]);

    // Poll 30s
    useEffect(() => {
        const iv = setInterval(() => {
            dispatch(fetchTickets({ page: 0, size, q: q || undefined }));
        }, 30000);
        return () => clearInterval(iv);
    }, [dispatch, q, size]);

    const filtered = useMemo(() => {
        if (!q) return items;
        const k = q.toLowerCase();
        return items.filter(
            (t) =>
                t.subject.toLowerCase().includes(k) ||
                t.lastFrom.toLowerCase().includes(k) ||
                (t.lastSnippet || '').toLowerCase().includes(k),
        );
    }, [items, q]);

    const canLoadMore = page + 1 < totalPages;

    const badge = (s: string) => {
        const base = 'text-xs px-2 py-0.5 rounded';
        if (s.toUpperCase() === 'OPEN') return <span className={`${base} bg-green-600 text-white`}>OPEN</span>;
        if (s.toUpperCase() === 'PENDING') return <span className={`${base} bg-yellow-600 text-white`}>PENDING</span>;
        if (s.toUpperCase() === 'CLOSED') return <span className={`${base} bg-gray-600 text-white`}>CLOSED</span>;
        return <span className={`${base} bg-slate-600 text-white`}>{s}</span>;
    };

    const onRefresh = () => dispatch(fetchTickets({ page: 0, size, q: q || undefined }));
    const onLoadMore = () => canLoadMore && dispatch(fetchMoreTickets({ nextPage: page + 1, size, q: q || undefined }));

    const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files ? Array.from(e.target.files) : [];
        setFiles(list);
    };

    const onSendReply = async () => {
        if (!selectedTicket) return;
        const bodyHtml = replyRef.current?.value?.trim() || '';
        const payload = {
            bodyHtml,
            // Có thể điền CC/TO/subjectOverride tùy luồng; mặc định để BE reply theo thread
        };
        try {
            await dispatch(sendReply({ ticketId: selectedTicket.id, payload, files })).unwrap();

            if (replyRef.current) replyRef.current.value = '';
            setFiles([]);
            dispatch(fetchMessages(selectedTicket.id));
        } catch (error: unknown) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error sending reply:', error);
            }
        }

    };

    return (
        <div className="flex h-full">
            {/* LEFT: List */}
            <div className="w-[380px] border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-2">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Tìm theo subject/email/nội dung…"
                            className="w-full rounded-md border px-3 py-2 text-sm bg-white/5"
                        />
                        <button
                            onClick={onRefresh}
                            className="rounded-md border px-3 text-sm hover:bg-white/10"
                            disabled={loading}
                        >
                            Refresh
                        </button>
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">Lỗi: {error}</p>}
                </div>

                <div className="flex-1 overflow-auto">
                    {filtered.map((t) => {
                        const isSel = t.id === selectedId;
                        const isOpen = t.status.toUpperCase() === 'OPEN';
                        return (
                            <button
                                key={t.id}
                                onClick={() => dispatch(selectTicket(t.id))}
                                className={`w-full text-left p-3 border-b border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50/40 dark:hover:bg-slate-800/40 ${
                                    isSel ? 'bg-slate-100/60 dark:bg-slate-800/60' : ''
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                                                {t.lastFrom?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="truncate text-sm font-medium">{t.lastFrom}</div>
                                        </div>
                                        <div className="mt-1 text-sm font-semibold line-clamp-2">{t.subject}</div>
                                        <div className="mt-1 text-xs text-slate-500 line-clamp-1">{t.lastSnippet}</div>
                                        <div className="mt-1 text-[11px] text-slate-500">{formatDateTime(t.lastMessageAt)}</div>
                                    </div>
                                    <div className="shrink-0">
                                        {badge(t.status)}
                                        {isOpen && <div className="mt-1 h-1 rounded bg-indigo-500" />}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Trang {page + 1}/{Math.max(totalPages, 1)}
          </span>
                    <button
                        onClick={onLoadMore}
                        disabled={!canLoadMore || loading}
                        className="text-xs rounded-md border px-2 py-1 hover:bg-white/10 disabled:opacity-50"
                    >
                        {canLoadMore ? 'Tải thêm' : 'Hết'}
                    </button>
                </div>
            </div>

            {/* RIGHT: Detail */}
            <div className="flex-1 min-w-0">
                {selectedTicket ? (
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                    <h1 className="text-lg font-semibold">{selectedTicket.subject}</h1>
                                    <div className="mt-1 text-sm text-slate-500 flex flex-wrap gap-2">
                                        <span>From: {selectedTicket.lastFrom}</span>
                                        <span>•</span>
                                        <span>Last: {formatDateTime(selectedTicket.lastMessageAt)}</span>
                                        <span>•</span>
                                        <span>Thread: {selectedTicket.threadId}</span>
                                        <span>•</span>
                                        <span>Created: {formatDateTime(selectedTicket.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {badge(selectedTicket.status)}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-4 space-y-4">
                            {/* Preview nhanh (nếu chưa gọi messages) */}
                            {!messagesByTicket[selectedTicket.id] && (
                                <div className="border rounded-md p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">
                                            {selectedTicket.lastFrom?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium">{selectedTicket.lastFrom}</div>
                                            <div className="text-sm text-slate-500">{formatDateTime(selectedTicket.lastMessageAt)}</div>
                                        </div>
                                    </div>
                                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                        {selectedTicket.lastSnippet || '(Không có preview)'}
                                    </div>
                                </div>
                            )}

                            {/* Thread messages (nếu có) */}
                            {messagesByTicket[selectedTicket.id]?.map((m) => (
                                <div key={m.messageId} className="border rounded-md p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
                                            {m.from?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium">{m.from}</div>
                                            <div className="text-sm text-slate-500">{formatDateTime(m.receivedAt)}</div>
                                        </div>
                                    </div>
                                    {m.bodyHtml ? (
                                        <div
                                            className="prose prose-sm dark:prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: m.bodyHtml }}
                                        />
                                    ) : (
                                        <div className="text-sm whitespace-pre-wrap">{m.bodyText}</div>
                                    )}
                                </div>
                            ))}

                            {/* Composer */}
                            <div className="border rounded-md">
                                <div className="p-3 border-b text-sm font-medium">Reply</div>
                                <div className="p-3 space-y-3">
                  <textarea
                      ref={replyRef}
                      className="w-full min-h-28 rounded-md border px-3 py-2 text-sm bg-white/5"
                      placeholder="Nhập nội dung (HTML cho phép)…"
                  />
                                    <div className="flex items-center gap-2">
                                        <input multiple type="file" onChange={onChangeFiles} />
                                        {files.length > 0 && (
                                            <span className="text-xs text-slate-500">{files.length} file đính kèm</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={onSendReply}
                                            disabled={sending}
                                            className="rounded-md border px-4 py-2 text-sm bg-indigo-600 text-white hover:opacity-90 disabled:opacity-50"
                                        >
                                            {sending ? 'Đang gửi…' : 'Gửi'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (replyRef.current) {
                                                    replyRef.current.value = '';
                                                }
                                                setFiles([]);
                                            }}
                                            className="rounded-md border px-4 py-2 text-sm hover:bg-white/10"
                                        >
                                            Hủy
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="h-full grid place-items-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📬</div>
                            <div className="text-lg font-medium">Chọn một ticket ở danh sách bên trái</div>
                            <div className="text-slate-500">Để xem chi tiết và trả lời</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
