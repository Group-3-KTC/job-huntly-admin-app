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