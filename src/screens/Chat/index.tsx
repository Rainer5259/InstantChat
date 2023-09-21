import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  child,
  getDatabase,
  onValue,
  push,
  ref,
  update,
} from 'firebase/database';
import {useSelector, useDispatch} from 'react-redux';
import {v4 as uuidV4} from 'uuid';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import CryptoJS from 'react-native-crypto-js';

import MessageContainer from '../../components/MessageList';
import ButtonComponent from '../../components/ButtonComponent';
import GeometryBackground from '../../assets/svg/geometry_background_icon.svg';
import CopyIcon from '../../assets/svg/copy_to_clipboard_icon.svg';
import SentButtonIcon from '../../assets/svg/sent_button_icon.svg';

import {RootState} from '../../redux/store';
import {setChatData} from '../../redux/features/chatData';
import {UpdatesMessageProps, UpdatesUserIDProps} from '../../types/chat';

import styles from './styles';
import app from '../../services/firebase';
import LottieView from 'lottie-react-native';

const ChatContainer = () => {
  const {chat_id, users, subject, message} = useSelector(
    (state: RootState) => state.chatDataSlice,
  );
  const [messageText, setMessageText] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const randomUserID: string = uuidV4();
  const dispatch = useDispatch();
  const db = getDatabase(app);
  const chatRef = ref(db, `chats/${chat_id}/`);
  const LottieViewAnimated = Animated.createAnimatedComponent(LottieView);
  const [showDollTyping, setShowDollTyping] = useState<boolean>(true);
  const translateXNegative = useRef(new Animated.Value(1)).current;

  const setGuestID = async () => {
    let alreadyExistHostID = users.host_id === '' ? 'host_id' : 'guest_id';

    const data = {user_id: randomUserID};
    const updates: UpdatesUserIDProps = {};
    const endpoint = `/chats/${chat_id}/users/${alreadyExistHostID}`;

    updates[endpoint] = data.user_id;

    return await update(ref(db), updates)
      .then(() => {
        setUserID(randomUserID);
      })
      .catch(err => err);
  };

  const handleJoinWithChatID = async () => {
    onValue(
      chatRef,
      snapshot => {
        if (snapshot.exists()) {
          dispatch(setChatData(snapshot.val()));
          return;
        }
        return;
      },
      {onlyOnce: true},
    );
  };

  const handleSendMessage = async () => {
    const getCurrentDate = new Date().toString().slice(0, -8);
    const db = getDatabase(app);
    const updates: UpdatesMessageProps = {};
    const messageKey: string | null = push(child(ref(db), 'chats')).key;
    const endpoint = '/chats/' + chat_id + '/message/';

    let content = CryptoJS.AES.encrypt(
      messageText,
      process.env.MESSAGE_CRYPTOGRAPHY_KEY!,
    ).toString();

    let messageContent = [
      ...message,
      {
        key: messageKey,
        user_id: userID,
        content: content,
        created_at: getCurrentDate,
        updated_at: getCurrentDate,
      },
    ];

    updates[endpoint] = messageContent;

    setMessageText('');

    return update(ref(db), updates)
      .then(() => {
        onValue(chatRef, snapshot => {
          dispatch(setChatData(snapshot.val()));
          return;
        });
      })
      .catch(err => {});
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

  useEffect(() => {
    handleJoinWithChatID();
  }, []);

  useEffect(() => {
    setGuestID();
  }, []);

  useEffect(() => {
    if (message.length > 0) {
      const dollTypingAnimation = Animated.timing(translateXNegative, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      });

      const timeout = setTimeout(() => {
        dollTypingAnimation.start(() => {
          setShowDollTyping(false);
          clearTimeout(timeout);
          dollTypingAnimation.stop();
        });
      }, 1000);
      return;
    }
  }, [message.length > 0]);

  const DollTypingAnimated = useMemo(() => {
    return (
      <LottieViewAnimated
        source={require('../../assets/json/doll_typing.json')}
        speed={0.4}
        autoPlay
        style={[styles.lottieViewContainer, {opacity: translateXNegative}]}
      />
    );
  }, []);

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

        {showDollTyping && DollTypingAnimated}

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
