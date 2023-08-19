import React, {useEffect} from 'react';
import styles from './styles';
import app from '../../services/firebase';
import CryptoJS from 'react-native-crypto-js';

import {View, Text, FlatList} from 'react-native';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {setChatData} from '../../redux/features/chatData';
import {ChatProps, MessageProps} from '../../types/chat';
import {getDatabase, onValue, ref} from 'firebase/database';

interface FlatListMessageProps {
  item: MessageProps;
}
const MessageContainer = () => {
  const {message, users, chat_id}: ChatProps = useSelector(
    (state: RootState) => state.chatDataSlice,
  );

  let user_id = users.host_id || users.guest_id;

  const dispatch = useDispatch();

  const fetchChatByIDFromAPI = async () => {
    const db = getDatabase(app);
    const chatRef = ref(db, `chats/${chat_id}`);

    onValue(chatRef, snapshot => {
      const data: ChatProps = snapshot.val();
      dispatch(setChatData(data));
    });
  };

  useEffect(() => {
    fetchChatByIDFromAPI();
  }, []);

  const RenderMessage = ({item}: FlatListMessageProps) => {
    let decryptedMessage = CryptoJS.AES.decrypt(
      item.content,
      process.env.MESSAGE_CRYPTOGRAPHY_KEY!,
    );
    let originalMessage = decryptedMessage.toString(CryptoJS.enc.Utf8);

    return (
      <View style={[styles.messageContainer]}>
        <Text>Sender: ****-{user_id.substring(24, 36)}</Text>
        <Text>content: {originalMessage}</Text>
        <Text>Created At: {item.created_at}</Text>
      </View>
    );
  };

  return message.length === 0 ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.primaryTextBold}>Let's talk - Write something</Text>
    </View>
  ) : (
    <FlatList
      data={Object.values(message)}
      renderItem={({item}: FlatListMessageProps) => (
        <RenderMessage item={item} />
      )}
    />
  );
};

export default MessageContainer;
