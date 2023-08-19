import {Text, TextInput, View} from 'react-native';
import {useState} from 'react';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import {MessageProps} from '../../types/chat';
import {child, getDatabase, push, ref, update} from 'firebase/database';

import Clipboard from '@react-native-clipboard/clipboard';
import MessageContainer from './MessageContainer';
import ButtonComponent from '../../components/ButtonComponent';
import HorizontalSeparatorComponent from '../../components/HorizontalSeparatorComponent';
import styles from './styles';
import CryptoJS from 'react-native-crypto-js';
import app from '../../services/firebase';
import Toast from 'react-native-toast-message';

interface UpdatesProps {
  [key: string]: MessageProps;
}
type NewMessageKey = string | null;

const ChatContainer = () => {
  const {chat_id, users, subject} = useSelector(
    (state: RootState) => state.chatDataSlice,
  );

  const [messageText, setMessageText] = useState<string>('');

  const handleSend = () => {
    const getCurrentDate = new Date().getTime().toString();

    let content = CryptoJS.AES.encrypt(
      messageText,
      process.env.MESSAGE_CRYPTOGRAPHY_KEY!,
    ).toString();

    let data = {
      user_id: users.host_id || users.guest_id,
      content: content,
      created_at: getCurrentDate,
      updated_at: getCurrentDate,
    };

    const db = getDatabase(app);
    const updates: UpdatesProps = {};
    const newMessageKey: NewMessageKey = push(child(ref(db), 'chats')).key;
    const endpoint = '/chats/' + chat_id + '/message/' + newMessageKey;

    updates[endpoint] = data;

    setMessageText('');

    return update(ref(db), updates);
  };

  const copyChatIDToClipboard = async () => {
    Clipboard.setString(chat_id);
    Toast.show({
      type: 'success',
      text1: 'Chat ID Copied',
      text2: 'Invite someone to talk 👋',
      position: 'bottom',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.subjectAlignment}>
        <ButtonComponent
          onPress={() => copyChatIDToClipboard()}
          activeOpacity={0.8}
          style={styles.clipboardButton}>
          <Text style={styles.textPadding}>
            <Text style={styles.primaryTextBold}>Chat ID:</Text> {chat_id}
          </Text>
        </ButtonComponent>
        <Text style={styles.textPadding}>
          <Text style={styles.primaryTextBold}>Subject:</Text> {subject}
        </Text>
      </View>

      <HorizontalSeparatorComponent />

      <MessageContainer />

      <View style={styles.footerAlignment}>
        <TextInput
          style={styles.inputTextContainer}
          value={messageText}
          onChangeText={e => setMessageText(e)}
        />
        <ButtonComponent
          style={styles.sendButton}
          activeOpacity={0.8}
          onPress={() => handleSend()}>
          <Text>Send</Text>
        </ButtonComponent>
      </View>
    </View>
  );
};
export default ChatContainer;
