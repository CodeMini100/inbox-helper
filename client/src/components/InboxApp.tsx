import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, Loader, Paper, Container, Box } from '@mantine/core';
import { fetchInbox } from '../api/inboxApi';
import { Email } from '../types';
import EmailListItem from './EmailListItem';
import EmailPanel from './EmailPanel';
import './resizable.css';

const InboxApp: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(380); // Wider sidebar
  const resizeRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const loadEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInbox(20);
      setEmails(data.emails);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to load emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  useEffect(() => {
    const resizeBar = resizeRef.current;
    const sidebar = sidebarRef.current;
    
    if (!resizeBar || !sidebar) return;
    
    let startX = 0;
    let startWidth = 0;
    
    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = sidebar.offsetWidth;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (sidebar) {
        const newWidth = startWidth + e.clientX - startX;
        if (newWidth > 200 && newWidth < 600) {
          setSidebarWidth(newWidth);
        }
      }
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    resizeBar.addEventListener('mousedown', onMouseDown);
    
    return () => {
      resizeBar.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleEmailSelect = (email: Email) => {
    setSelectedEmailId(email.thread_id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Removed header */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          style={{ 
            width: `${sidebarWidth}px`, 
            borderRight: '1px solid #e9ecef', 
            overflowY: 'auto', 
            padding: '15px', 
            background: '#f8f9fa'
          }}
        >
          <div style={{ 
            marginBottom: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0 5px 15px 5px',
            borderBottom: '1px solid #e9ecef'
          }}>
            <Text style={{ fontWeight: 600, fontSize: '18px', color: '#495057' }}>Inbox Helper</Text>
            <Button 
              onClick={loadEmails} 
              disabled={loading}
              size="sm"
              variant="light"
              style={{
                borderRadius: '20px',
                backgroundColor: '#4dabf7',
                color: 'white',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(77, 171, 247, 0.2)',
                border: 'none',
                padding: '4px 12px'
              }}
            >
              Refresh
            </Button>
          </div>
          
          {loading && <Loader style={{ margin: '20px auto', display: 'block' }} />}
          
          {error && <Text color="red" style={{ padding: '10px' }}>{error}</Text>}
          
          {!loading && emails.length === 0 && (
            <Text color="dimmed" style={{ textAlign: 'center', padding: '10px' }}>No emails found</Text>
          )}
          
          <div className="email-list">
            {emails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                selected={email.thread_id === selectedEmailId}
                onClick={() => handleEmailSelect(email)}
              />
            ))}
          </div>
        </div>
        
        {/* Resize handle */}
        <div 
          ref={resizeRef}
          className="resize-handle"
          style={{
            width: '5px',
            cursor: 'col-resize',
            background: '#e9ecef',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="resize-indicator"></div>
        </div>
        
        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px', 
          background: 'white' 
        }}>
          <EmailPanel threadId={selectedEmailId} />
        </div>
      </div>
    </div>
  );
};

export default InboxApp; 