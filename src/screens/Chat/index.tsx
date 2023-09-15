import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {ChatProps, MessageProps} from '../../types/chat';
import {
  child,
  getDatabase,
  onValue,
  push,
  ref,
  update,
} from 'firebase/database';
import Clipboard from '@react-native-clipboard/clipboard';
import MessageContainer from '../../components/MessageList';
import ButtonComponent from '../../components/ButtonComponent';
import styles from './styles';
import CryptoJS from 'react-native-crypto-js';
import app from '../../services/firebase';
import Toast from 'react-native-toast-message';
import {v4 as uuidV4} from 'uuid';
import 'react-native-get-random-values';
import CopyIcon from '../../assets/svg/copy_to_clipboard_icon.svg';
import SentButtonIcon from '../../assets/svg/sent_button_icon.svg';
import GeometryBackground from '../../assets/svg/geometry_background_icon.svg';
import {setChatData} from '../../redux/features/chatData';

interface UpdatesProps {
  [key: string]: MessageProps;
}
type NewMessageKey = string | null;

type UpdatesUserIDProps = {[key: string]: string};

const ChatContainer = () => {
  const [messageText, setMessageText] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const randomUserID: string = uuidV4();
  const dispatch = useDispatch();
  const db = getDatabase(app);
  const {chat_id, users, subject} = useSelector(
    (state: RootState) => state.chatDataSlice,
  );

  const fetchLiveChats = async () => {
    const chatRef = ref(db, `chats/${chat_id}/`);

    onValue(chatRef, snapshot => {
      if (snapshot.exists()) {
        dispatch(setChatData(snapshot.val()));
        return;
      }
      return;
    });
  };

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

  useEffect(() => {
    fetchLiveChats();
    setGuestID();
  }, []);
  const handleSendMessage = () => {
    const getCurrentDate = new Date().toString().slice(0, -8);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : -250}
      style={styles.container}>
      <View style={styles.content}>
        <GeometryBackground style={styles.geometryBackground} />
        <View style={styles.header}>
          <View style={styles.headerAlignmentButton}>
            <View style={styles.headerChatIDBorder}>
              <Text style={styles.textPadding}>
                <Text style={styles.primaryTextBold}>Chat ID:</Text> {chat_id}
              </Text>
            </View>
            <ButtonComponent
              onPress={() => copyChatIDToClipboard()}
              activeOpacity={0.8}
              style={styles.clipboardButton}>
              <CopyIcon width={18} height={28} />
            </ButtonComponent>
          </View>
          <View style={styles.headerSubjectBorder}>
            <Text style={styles.textPadding}>
              <Text style={styles.primaryTextBold}>Subject:</Text> {subject}
            </Text>
          </View>
        </View>
        <MessageContainer />
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTextContainer}
              value={messageText}
              onChangeText={e => setMessageText(e)}
            />
            <ButtonComponent
              activeOpacity={0.8}
              onPress={() => handleSendMessage()}>
              <SentButtonIcon height={24} width={24} />
            </ButtonComponent>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default ChatContainer;
