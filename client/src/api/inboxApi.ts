import axios from 'axios';
import { InboxResponse, ThreadResponse, Draft, DraftsResponse, SendDraftResponse } from '../types';

const API_BASE = '/api';

export const fetchInbox = async (maxResults: number = 10): Promise<InboxResponse> => {
  const response = await axios.get<InboxResponse>(`${API_BASE}/inbox?max_results=${maxResults}`);
  return response.data;
};

export const fetchThread = async (threadId: string): Promise<ThreadResponse> => {
  const response = await axios.get<ThreadResponse>(`${API_BASE}/thread/${threadId}`);
  return response.data;
};

export const generateDraft = async (threadId: string): Promise<string> => {
  const response = await axios.post<string>(`${API_BASE}/draft?thread_id=${threadId}`, null, {
    headers: {
      'Accept': 'text/plain'
    }
  });
  return response.data;
};

export const fetchDrafts = async (threadId?: string): Promise<DraftsResponse> => {
  const url = threadId ? `${API_BASE}/drafts?thread_id=${threadId}` : `${API_BASE}/drafts`;
  const response = await axios.get<DraftsResponse>(url);
  return response.data;
};

export const sendDraft = async (draftId: number): Promise<SendDraftResponse> => {
  const response = await axios.post<SendDraftResponse>(`${API_BASE}/send/${draftId}`);
  return response.data;
}; 