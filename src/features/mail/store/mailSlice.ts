import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PageResp, TicketMessage, TicketSummary, ReplyRequest } from '../../../types/mail.type.ts';
import { getTickets, getTicketMessages, replyTicket } from '../services/mailApi';

type MailState = {
    items: TicketSummary[];
    loading: boolean;
    error?: string | null;
    page: number;
    size: number;
    totalPages: number;
    selectedId?: number;
    messagesByTicket: Record<number, TicketMessage[]>;
    sending: boolean;
};

const initialState: MailState = {
    items: [],
    loading: false,
    error: null,
    page: 0,
    size: 20,
    totalPages: 0,
    selectedId: undefined,
    messagesByTicket: {},
    sending: false,
};

export const fetchTickets = createAsyncThunk(
    'mail/fetchTickets',
    async ({ page, size, q }: { page: number; size: number; q?: string }) => {
        const data = await getTickets(page, size, q);
        return data;
    },
);

export const fetchMoreTickets = createAsyncThunk(
    'mail/fetchMoreTickets',
    async ({ nextPage, size, q }: { nextPage: number; size: number; q?: string }) => {
        const data = await getTickets(nextPage, size, q);
        return data;
    },
);

export const fetchMessages = createAsyncThunk(
    'mail/fetchMessages',
    async (ticketId: number) => {
        const data = await getTicketMessages(ticketId);
        return { ticketId, data };
    },
);

export const sendReply = createAsyncThunk(
    'mail/sendReply',
    async ({ ticketId, payload, files }: { ticketId: number; payload: ReplyRequest; files?: File[] }) => {
        const data = await replyTicket(ticketId, payload, files);
        return { ticketId, data };
    },
);

const mailSlice = createSlice({
    name: 'mail',
    initialState,
    reducers: {
        selectTicket(state, action: PayloadAction<number | undefined>) {
            state.selectedId = action.payload;
        },
        resetMail(state) {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchTickets.fulfilled, (s, a: PayloadAction<PageResp<TicketSummary>>) => {
                s.loading = false;
                s.items = a.payload.content;
                s.page = a.payload.number;
                s.totalPages = a.payload.totalPages;
                if (s.items.length && s.selectedId == null) {
                    s.selectedId = s.items[0].id;
                }
            })
            .addCase(fetchTickets.rejected, (s, a) => {
                s.loading = false;
                s.error = (a.error?.message as string) || 'Load tickets failed';
            });

        builder
            .addCase(fetchMoreTickets.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchMoreTickets.fulfilled, (s, a: PayloadAction<PageResp<TicketSummary>>) => {
                s.loading = false;
                s.items = [...s.items, ...a.payload.content];
                s.page = a.payload.number;
                s.totalPages = a.payload.totalPages;
            })
            .addCase(fetchMoreTickets.rejected, (s, a) => {
                s.loading = false;
                s.error = (a.error?.message as string) || 'Load more failed';
            });

        builder
            .addCase(fetchMessages.fulfilled, (s, a) => {
                s.messagesByTicket[a.payload.ticketId] = a.payload.data;
            });

        builder
            .addCase(sendReply.pending, (s) => {
                s.sending = true;
                s.error = null;
            })
            .addCase(sendReply.fulfilled, (s) => {
                s.sending = false;
            })
            .addCase(sendReply.rejected, (s, a) => {
                s.sending = false;
                s.error = (a.error?.message as string) || 'Send reply failed';
            });
    },
});

export const { selectTicket, resetMail } = mailSlice.actions;
export default mailSlice.reducer;
