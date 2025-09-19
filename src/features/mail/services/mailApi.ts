import { api } from "../../../config/api.ts";
import type {PageResp} from "../../../types/mail.type.ts";
import type { InboxItemDto, MessageDto, ReplyRequest, ReplyResultDto, TicketStatus } from "../../../types/mail.type.ts";

export async function fetchTickets(params: {
    status?: TicketStatus;
    q?: string;
    customerEmail?: string;
    page?: number;
    size?: number;
    sort?: string;
}) {
    const res = await api.get<PageResp<InboxItemDto>>("/tickets", { params });
    return res.data;
}

export async function fetchMessages(ticketId: number, page = 0, size = 100) {
    const res = await api.get<PageResp<MessageDto>>(`/tickets/${ticketId}/messages`, { params: { page, size } });
    return res.data;
}

export async function replyTicket(ticketId: number, body: ReplyRequest) {
    const res = await api.post<ReplyResultDto>(`/tickets/${ticketId}/reply`, body);
    return res.data;
}

export async function triggerPollNow() {
    const res = await api.post("/tickets/poll-now", null, {
        timeout: 5000,
        validateStatus: () => true,
    });
    console.log("[poll-now] url:", res.request?.responseURL ?? "(unknown)");
    console.log("[poll-now] status:", res.status);
    console.log("[poll-now] data:", res.data);
    return res;
}

export async function getPollStatus() {
    const { data } = await api.get("/tickets/poll-status", { timeout: 3000 });
    return data as { state: "IDLE"|"RUNNING"|"RECENTLY_DONE"|"ERROR"; lastError?: string };
}

export async function updateTicketStatus(ticketId: number, status: "OPEN"|"PENDING"|"CLOSED") {
    const { data } = await api.patch<{ id:number; status:string }>(`/tickets/${ticketId}/status`, { status });
    return data;
}
