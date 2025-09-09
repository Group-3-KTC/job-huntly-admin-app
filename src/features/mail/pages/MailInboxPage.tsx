import { useState } from "react";
import InboxList from "../components/InboxList";
import ThreadPane from "../components/ThreadPane";
import type { InboxItemDto } from "../../../types/mail.type.ts";

export default function MailInboxPage() {
    const [selected, setSelected] = useState<InboxItemDto | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="h-[calc(100vh-6rem)] grid grid-cols-12 gap-4 p-4 bg-gray-50">
            <div className="col-span-4">
                <InboxList
                    selectedId={selected?.id ?? null}
                    onSelect={(t) => setSelected(t)}
                    refreshKey={refreshKey}
                />
            </div>
            <div className="col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <ThreadPane
                        selected={selected}
                        onReplied={() => setRefreshKey(k => k + 1)}
                    />
                </div>
            </div>
        </div>
    );
}
