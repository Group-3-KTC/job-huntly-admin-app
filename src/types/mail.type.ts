export type TicketStatus = "OPEN" | "PENDING" | "CLOSED";

export interface PageResp<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // current page
    size: number;
    first: boolean;
    last: boolean;
}

export interface InboxItemDto {
    id: number;
    subject: string;
    status: TicketStatus;
    customerEmail: string | null;
    createdAt: string;
    threadId: string;
    lastMessageAt: string | null;
    lastFrom: string | null;
    lastSnippet: string | null;
}

export interface MessageDto {
    id: number;
    ticketId: number;
    messageId: string;
    inReplyTo: string | null;
    fromEmail: string;
    sentAt: string;
    direction: "INBOUND" | "OUTBOUND";
    bodyText: string | null;
    bodyHtml: string | null;
}

export interface ReplyRequest {
    bodyHtml: string;
    cc?: string[] | null;
    to?: string[] | null;
    subjectOverride?: string | null;
    replyToMessageId?: string | null;
}

export interface ReplyResultDto {
    ticketId: number;
    ticketMessageId: number;
    messageId: string;
    direction: "OUTBOUND";
    sentAt: string;
}
