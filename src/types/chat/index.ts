export interface MessageProps {
  key: string | null;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ChatProps {
  chat_id: string;
  users: { host_id: string; guest_id: string };
  subject: string;
  users_limit_per_chat: number;
  created_at: string;
  updated_at: string;
  message: MessageProps[];
}

export type UpdatesMessageProps = Record<string, MessageProps[]>;

export type UpdatesUserIDProps = Record<string, string>;
