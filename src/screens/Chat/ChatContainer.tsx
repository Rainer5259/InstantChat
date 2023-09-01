import {Text, TextInput, View} from 'react-native';
import {useEffect, useState} from 'react';
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
import {v4 as uuidV4} from 'uuid';
import 'react-native-get-random-values';
import CopyIcon from '../../assets/svg/copy_to_clipboard_icon.svg';
interface UpdatesProps {
  [key: string]: MessageProps;
}
type NewMessageKey = string | null;

type UpdatesUserIDProps = {[key: string]: string};

const ChatContainer = () => {
  const {chat_id, users, subject} = useSelector(
    (state: RootState) => state.chatDataSlice,
  );
  const [messageText, setMessageText] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const randomUserID: string = uuidV4();
  useEffect(() => {
    const db = getDatabase(app);
    const setGuestID = async () => {
      let alreadyHostID = users.host_id === '' ? 'host_id' : 'guest_id';

      const data = {user_id: randomUserID};
      const updates: UpdatesUserIDProps = {};
      const endpoint = `/chats/${chat_id}/users/${alreadyHostID}`;
      updates[endpoint] = data.user_id;
      return await update(ref(db), updates)
        .then(() => {
          setUserID(randomUserID);
        })
        .catch(err => err);
    };
    setGuestID();
  }, []);
  const handleSend = () => {
    const getCurrentDate = new Date().getTime().toString();
    let content = CryptoJS.AES.encrypt(
      messageText,
      process.env.MESSAGE_CRYPTOGRAPHY_KEY!,
    ).toString();

    let data = {
      user_id: userID,
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
      <View style={styles.header}>
        <View style={styles.headerAlignmentButton}>
          <Text style={styles.textPadding}>
            <Text style={styles.primaryTextBold}>Chat ID:</Text> {chat_id}
          </Text>
          <ButtonComponent
            onPress={() => copyChatIDToClipboard()}
            activeOpacity={0.8}
            style={styles.clipboardButton}>
            <CopyIcon />
          </ButtonComponent>
        </View>
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
