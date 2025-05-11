import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const extractName = (email: string): string => {
  const match = email.match(/^([^<]+)/);
  if (match && match[1].trim()) {
    return match[1].trim();
  }
  return email.split('@')[0] || email;
};

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  
  try {
    const date = parseISO(dateStr);
    
    // Always format as MM/DD HH:MM CST
    return format(date, 'MM/dd HH:mm') + ' CST';
  } catch (e) {
    // If date parsing fails, return the original string
    return dateStr;
  }
};

export const truncateSubject = (subject: string | null, length: number = 60): string => {
  if (!subject) return 'No Subject';
  
  if (subject.length <= length) {
    return subject;
  }
  
  return `${subject.substring(0, length)}...`;
}; 