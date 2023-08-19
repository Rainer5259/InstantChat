import app from '../../services/firebase';
import ChatContainer from './ChatContainer';

import {getDatabase, onValue, ref} from 'firebase/database';
import {useEffect} from 'react';
import {ChatProps} from '../../types/chat';
import {useDispatch, useSelector} from 'react-redux';
import {setChatData} from '../../redux/features/chatData';
import {RootState} from '../../redux/store';

const Chat = () => {
  const dispatch = useDispatch();

  const {chat_id}: ChatProps = useSelector(
    (state: RootState) => state.chatDataSlice,
  );

  const getChats = async () => {
    const db = getDatabase(app);
    const chatRef = ref(db, `chats/${chat_id}/`);
    onValue(chatRef, snapshot => {
      if (snapshot.exists()) {
        dispatch(setChatData(snapshot.val()));
        return;
      }
      return;
    });
  };

  useEffect(() => {
    getChats();
  }, []);

  return <ChatContainer />;
};
export default Chat;
