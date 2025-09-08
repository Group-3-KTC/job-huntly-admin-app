export interface TicketSummary {
    id: number;
    subject: string;
    status: 'OPEN' | 'PENDING' | 'CLOSED' | string;
    createdAt: string;
    threadId: string;
    lastMessageAt: string;
    lastFrom: string;
    lastSnippet: string;
}

export interface PageResp<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface TicketMessage {
    id: number;
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    messageId: string;
    receivedAt: string;
}

export interface ReplyRequest {
    bodyHtml: string;
    cc?: string[];
    to?: string[];
    subjectOverride?: string;
    replyToMessageId?: string;
}
