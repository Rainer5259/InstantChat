import MessageProps from './MessageProps';

interface ChatProps {
  chat_id: string;
  users: {host_id: string; guest_id: string};
  subject: string;
  users_limit_per_chat: number;
  created_at: string;
  updated_at: string;
  message: MessageProps[];
}

export default ChatProps;
