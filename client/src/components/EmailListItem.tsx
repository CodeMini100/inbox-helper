import React from 'react';
import { Paper } from '@mantine/core';
import { Email } from '../types';
import { extractName, formatDate, truncateSubject } from '../utils/emailUtils';

interface EmailListItemProps {
  email: Email;
  selected: boolean;
  onClick: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, selected, onClick }) => {
  const sender = extractName(email.from || '');
  const date = formatDate(email.date);
  const subject = truncateSubject(email.subject);
  
  return (
    <Paper 
      onClick={onClick}
      shadow="xs"
      style={{
        padding: '15px',
        marginBottom: '10px',
        cursor: 'pointer',
        borderRadius: '8px',
        borderLeft: selected ? '4px solid #4dabf7' : '4px solid transparent',
        backgroundColor: selected ? '#e7f5ff' : 'white',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 3px 6px rgba(77, 171, 247, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: selected ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '6px',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#495057'
        }}>
          {sender}
        </div>
        <div style={{ 
          color: '#868e96', 
          fontSize: '0.8rem',
          fontWeight: 500
        }}>
          {date}
        </div>
      </div>
      
      <div style={{ 
        fontWeight: 500, 
        marginBottom: '6px',
        color: '#343a40',
        fontSize: '0.93rem'
      }}>
        {subject}
      </div>
      
      <div style={{ 
        color: '#6c757d', 
        fontSize: '0.85rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: 1.4
      }}>
        {email.snippet}
      </div>
    </Paper>
  );
};

export default EmailListItem; 