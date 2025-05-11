import React, { useState, useEffect, useRef } from 'react';
import { Button, Loader, Paper, Textarea } from '@mantine/core';
import { ThreadResponse, Draft } from '../types';
import { fetchThread, generateDraft, fetchDrafts, sendDraft } from '../api/inboxApi';
import { extractName } from '../utils/emailUtils';

interface EmailPanelProps {
  threadId: string | null;
}

const EmailPanel: React.FC<EmailPanelProps> = ({ threadId }) => {
  const [thread, setThread] = useState<ThreadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftText, setDraftText] = useState<string>('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`;
    }
  }, [draftText]);

  useEffect(() => {
    if (!threadId) {
      setThread(null);
      setDraftText('');
      setDrafts([]);
      setDraftId(null);
      setSentSuccess(false);
      return;
    }

    const loadThreadAndDrafts = async () => {
      try {
        setLoading(true);
        
        // Fetch thread data
        const threadData = await fetchThread(threadId);
        setThread(threadData);
        
        // Check if there are existing drafts for this thread
        const draftsData = await fetchDrafts(threadId);
        setDrafts(draftsData.drafts);
        
        if (draftsData.drafts.length > 0) {
          // Use the most recent draft
          const latestDraft = draftsData.drafts.reduce((latest, draft) => 
            new Date(draft.created_at) > new Date(latest.created_at) ? draft : latest
          , draftsData.drafts[0]);
          
          setDraftText(latestDraft.draft_text);
          setDraftId(latestDraft.id);
        } else {
          setDraftText('');
          setDraftId(null);
        }
        
        setSentSuccess(false);
      } catch (error) {
        console.error('Error loading thread or drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThreadAndDrafts();
  }, [threadId]);

  const handleGenerateDraft = async () => {
    if (!threadId) return;
    
    try {
      setLoading(true);
      const newDraftText = await generateDraft(threadId);
      setDraftText(newDraftText);
      
      // Reload drafts to get the newly created draft
      const draftsData = await fetchDrafts(threadId);
      setDrafts(draftsData.drafts);
      
      if (draftsData.drafts.length > 0) {
        const latestDraft = draftsData.drafts.reduce((latest, draft) => 
          new Date(draft.created_at) > new Date(latest.created_at) ? draft : latest
        , draftsData.drafts[0]);
        
        setDraftId(latestDraft.id);
      }
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDraft = async () => {
    if (!draftId) return;
    
    try {
      setSending(true);
      await sendDraft(draftId);
      setSentSuccess(true);
      
      // Clear the draft text after successful send
      setDraftText('');
    } catch (error) {
      console.error('Error sending draft:', error);
    } finally {
      setSending(false);
    }
  };

  if (!threadId) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px',
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
      }}>
        <p style={{ 
          color: '#495057', 
          textAlign: 'center',
          fontSize: '1.1rem',
          fontWeight: 500,
          padding: '2rem',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          Select an email from the sidebar to view or reply
        </p>
      </div>
    );
  }

  if (loading && !thread) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {thread && (
        <>
          <h4 style={{ 
            margin: '0 0 16px',
            fontSize: '1.5rem',
            color: '#343a40',
            fontWeight: 600
          }}>
            {thread.messages[0]?.subject || 'No Subject'}
          </h4>
          
          <div style={{ marginTop: '16px' }}>
            {thread.messages.map((message) => (
              <Paper 
                key={message.id} 
                style={{ 
                  padding: '20px', 
                  marginBottom: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }} 
                withBorder
              >
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: '#343a40'
                  }}>
                    {extractName(message.from || '')}
                  </span>
                  <span style={{ 
                    fontSize: '0.9em', 
                    color: '#6c757d', 
                    marginLeft: '12px'
                  }}>
                    To: {extractName(message.to || '')}
                  </span>
                </div>
                <div style={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: '1.5',
                  color: '#495057',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}>
                  {message.body}
                </div>
              </Paper>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '32px', 
            marginBottom: '24px', 
            borderTop: '1px solid #dee2e6', 
            paddingTop: '16px', 
            position: 'relative' 
          }}>
            <span style={{ 
              position: 'absolute', 
              top: '-12px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              padding: '0 15px', 
              background: 'white',
              color: '#495057',
              fontWeight: 500,
              fontSize: '1.1rem'
            }}>
              Reply
            </span>
          </div>
          
          <div style={{ marginBottom: '16px', width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '20px' 
            }}>
              <Button 
                variant="outline" 
                onClick={handleGenerateDraft}
                loading={loading}
                disabled={loading || sending}
                style={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                  borderColor: '#4dabf7',
                  color: '#4dabf7',
                  background: 'white'
                }}
              >
                {drafts.length > 0 ? 'Regenerate Draft' : 'Generate Draft'}
              </Button>
              
              {draftId && (
                <Button 
                  color={sentSuccess ? 'green' : 'blue'} 
                  onClick={handleSendDraft}
                  loading={sending}
                  disabled={loading || sending || sentSuccess}
                  style={{
                    borderRadius: '20px',
                    padding: '8px 25px',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    background: sentSuccess ? '#40c057' : '#4dabf7',
                    border: 'none',
                    boxShadow: `0 4px 6px ${sentSuccess ? 'rgba(64, 192, 87, 0.2)' : 'rgba(77, 171, 247, 0.2)'}`,
                  }}
                >
                  {sentSuccess ? 'Sent Successfully' : 'Send Reply'}
                </Button>
              )}
            </div>
            
            <Paper
              style={{
                padding: '2px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                border: '1px solid #e9ecef',
                marginBottom: '20px',
                width: '100%'
              }}
            >
              <textarea
                ref={textareaRef}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Draft reply will appear here"
                disabled={sending}
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  padding: '16px',
                  borderRadius: '8px',
                  background: '#f8f9fa',
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '200px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}
              />
            </Paper>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailPanel; 