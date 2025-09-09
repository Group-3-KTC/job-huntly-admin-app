import type { MessageDto } from "../../../types/mail.type.ts";

const cls = (...xs: (string | false | undefined | null)[]) => xs.filter(Boolean).join(" ");
const fmtTime = (iso?: string | null) => iso ? new Date(iso).toLocaleString() : "";

export default function MessageBubble({ msg, me }: { msg: MessageDto; me: boolean }) {
    return (
        <div className={cls("max-w-[80%]", me ? "ml-auto" : "mr-auto")}
             title={`${msg.fromEmail} • ${fmtTime(msg.sentAt)}`}>
            <div className={cls(
                "rounded-2xl px-4 py-3 shadow-sm border",
                me ? "bg-indigo-600 text-white border-indigo-500" : "bg-white text-gray-900 border-gray-100"
            )}>
                {msg.bodyHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.bodyHtml }} />
                ) : (
                    <pre className="whitespace-pre-wrap font-sans">{msg.bodyText}</pre>
                )}
            </div>
            <div className={cls("mt-1 text-xs", me ? "text-indigo-800 text-right" : "text-gray-500")}>
                {fmtTime(msg.sentAt)}
            </div>
        </div>
    );
}
