export interface Email {
  id: string;
  thread_id: string;
  snippet: string;
  date: string;
  from: string;
  subject: string;
}

export interface InboxResponse {
  emails: Email[];
  count: number;
}

export interface Message {
  id: string;
  thread_id: string;
  date: string | null;
  from: string | null;
  to: string | null;
  subject: string | null;
  body: string;
}

export interface ThreadResponse {
  thread_id: string;
  messages: Message[];
  message_count: number;
}

export interface Draft {
  id: number;
  thread_id: string;
  draft_text: string;
  created_at: string;
  sent: boolean;
}

export interface DraftsResponse {
  drafts: Draft[];
}

export interface SendDraftResponse {
  message: string;
  message_id: string;
} 