import type { PageResp, TicketMessage, TicketSummary, ReplyRequest } from '../../../types/mail.type.ts';
import { MAIL_API } from '../../../config/api.ts';
import apiClient from '../../../config/axios.config.ts';

export async function getTickets(page = 0, size = 20, q?: string) {
    const resp = await apiClient.get<PageResp<TicketSummary>>(MAIL_API.list, {
        params: { page, size, q },
        withCredentials: true,
    });
    return resp.data;
}

export async function getTicketMessages(ticketId: number) {
    const resp = await apiClient.get<TicketMessage[]>(MAIL_API.messages(ticketId), {
        withCredentials: true,
    });
    return resp.data;
}

/**
 * Gửi reply dạng multipart (meta + files) đúng chuẩn BE yêu cầu:
 * - meta: JSON blob chứa ReplyRequest
 * - files: nhiều file đính kèm (tên field 'files' hoặc 'files[]' tùy BE; ở đây dùng 'files')
 */
export async function replyTicket(ticketId: number, payload: ReplyRequest, files?: File[]) {
    const form = new FormData();
    const meta = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    form.append('meta', meta);
    (files || []).forEach((f) => form.append('files', f, f.name));

    const resp = await apiClient.post(MAIL_API.reply(ticketId), form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resp.data;
}
