import app from '../../services/firebase';
import {set, ref, getDatabase} from 'firebase/database';
import {ChatProps} from '../../types/chat/';

const createChat = async ({
  chat_id,
  users,
  subject,
  users_limit_per_chat = 2,
  message,
  created_at,
  updated_at,
}: ChatProps) => {
  try {
    const db = getDatabase(app);

    let data = {
      chat_id,
      users,
      subject,
      users_limit_per_chat,
      message,
      created_at,
      updated_at,
    };

    await set(ref(db, 'chats/' + chat_id), data);
    return;
  } catch (err) {
    console.log('An error occurred while creating chat');
  }
};
export default createChat;
