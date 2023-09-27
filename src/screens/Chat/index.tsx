import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { child, getDatabase, onValue, push, ref, remove, update } from 'firebase/database';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidV4 } from 'uuid';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import CryptoJS from 'react-native-crypto-js';

import MessageContainer from '~/components/MessageList';
import ButtonComponent from '~/components/ButtonComponent';
import GeometryBackground from '~/assets/svg/geometry_background_icon.svg';
import CopyIcon from '~/assets/svg/copy_to_clipboard_icon.svg';
import SentButtonIcon from '~/assets/svg/sent_button_icon.svg';
import TrashIcon from '~/assets/svg/trash_icon.svg';
import HomeIcon from '~/assets/svg/home_icon.svg';
import OptionsIcon from '~/assets/svg/options_icon.svg';

import { type RootState } from '~/redux/store';
import { chatInitialState, setChatData } from '~/redux/features/chatData';
import { type UpdatesMessageProps, type UpdatesUserIDProps } from '~/types/chat';

import styles from './styles';
import app from '~/services/firebase';
import LottieView from 'lottie-react-native';
import { type ChatScreenCustomProps } from '~/routes/types';
import { OptionsButtons } from '~/components/OptionsButton';

const ChatContainer = ({ navigation }: ChatScreenCustomProps) => {
  const { chat_id, users, subject, message } = useSelector(
    (state: RootState) => state.chatDataSlice,
  );
  const [messageText, setMessageText] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const [showDollTyping, setShowDollTyping] = useState<boolean>(true);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const randomUserID: string = uuidV4();
  const dispatch = useDispatch();
  const db = getDatabase(app);
  const chatRef = ref(db, `chats/${chat_id}/`);
  const LottieViewAnimated = Animated.createAnimatedComponent(LottieView);

  const animatedRef = {
    translateY: useRef(new Animated.Value(0)).current,
    translateYNegative: useRef(new Animated.Value(0)).current,
    opacityMessageContainer: useRef(new Animated.Value(1)).current,
    opacityDollTyping: useRef(new Animated.Value(1)).current,
  };

  const startAnimation = (
    animatedValue: Animated.Value,
    toValue: number,
    callBack?: () => void,
  ) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 1500,
      useNativeDriver: false,
    }).start(callBack);
  };

  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const startAnimationWhenDeleteChat = Animated.parallel([
    Animated.timing(animatedRef.opacityDollTyping, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: false,
    }),
    Animated.timing(animatedRef.opacityMessageContainer, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: false,
    }),
    Animated.timing(animatedRef.translateY, {
      toValue: 400,
      duration: 1500,
      useNativeDriver: false,
    }),
    Animated.timing(animatedRef.translateYNegative, {
      toValue: -400,
      duration: 1500,
      useNativeDriver: false,
    }),
  ]);

  const setGuestID = async () => {
    const alreadyExistHostID = users.host_id === '' ? 'host_id' : 'guest_id';

    const data = { user_id: randomUserID };
    const updates: UpdatesUserIDProps = {};
    const endpoint = `/chats/${chat_id}/users/${alreadyExistHostID}`;

    updates[endpoint] = data.user_id;

    return await update(ref(db), updates)
      .then(() => {
        setUserID(randomUserID);
      })
      .catch((err) => err);
  };

  const handleJoinWithChatID = async () => {
    onValue(
      chatRef,
      (snapshot) => {
        if (snapshot.exists()) {
          dispatch(setChatData(snapshot.val()));
        }
      },
      { onlyOnce: true },
    );
  };

  const handleSendMessage = async () => {
    const getCurrentDate = new Date().toString().slice(0, -8);
    const updates: UpdatesMessageProps = {};
    const messageKey: string | null = push(child(ref(db), 'chats')).key;
    const endpoint = '/chats/' + chat_id + '/message/';

    const content = CryptoJS.AES.encrypt(
      messageText,
      process.env.MESSAGE_CRYPTOGRAPHY_KEY,
    ).toString();

    const messageContent = [
      ...message,
      {
        key: messageKey,
        user_id: userID,
        content,
        created_at: getCurrentDate,
        updated_at: getCurrentDate,
      },
    ];

    updates[endpoint] = messageContent;

    setMessageText('');

    await update(ref(db), updates)
      .then(() => {
        onValue(chatRef, (snapshot) => {
          dispatch(setChatData(snapshot.val()));
        });
      })
      .catch((err) => {});
  };

  const handleCopyChatIDToClipboard = async () => {
    Clipboard.setString(chat_id);
    Toast.show({
      type: 'success',
      text1: 'Chat ID Copied',
      text2: 'Invite someone to talk 👋',
      position: 'bottom',
    });
  };

  const handleDeleteChat = async () => {
    const endpoint = '/chats/' + chat_id;
    const chatReference = ref(db, endpoint);

    await remove(chatReference)
      .then(() => {
        startAnimationWhenDeleteChat.start(() => {
          Toast.show({ type: 'success', text1: 'Chat deleted successfully' });
          dispatch(setChatData(chatInitialState));
          navigateToHome();
        });
      })
      .catch(() => {
        Toast.show({ type: 'error', text1: 'An error occurred while deleting chat' });
      });
  };

  const handleShowOptions = () => {
    setShowOptions((state) => !state);
  };

  useEffect(() => {
    handleJoinWithChatID();
  }, []);

  useEffect(() => {
    setGuestID();
  }, []);

  useEffect(() => {
    if (message.length > 0) {
      const timeout = setTimeout(() => {
        startAnimation(animatedRef.opacityDollTyping, 0, () => {
          setShowDollTyping(false);
          clearTimeout(timeout);
        });
      }, 1000);
    }
  }, [message.length > 0]);

  const DollTypingAnimated = useMemo(() => {
    return (
      <LottieViewAnimated
        source={require('~/assets/json/doll_typing.json')}
        speed={0.4}
        autoPlay
        style={[styles.lottieViewContainer, { opacity: animatedRef.opacityDollTyping }]}
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
        <Animated.View
          style={[styles.header, { transform: [{ translateY: animatedRef.translateYNegative }] }]}>
          <View style={styles.headerAlignmentButton}>
            <View style={styles.headerChatIDBorder}>
              <Text style={styles.textPadding}>
                <Text style={styles.primaryTextBold}>Chat ID:</Text> {chat_id}
              </Text>
            </View>
          </View>
          <View style={styles.headerAlignmentButton}>
            <View style={styles.subjectContainer}>
              <Text style={styles.textPadding}>
                <Text style={styles.primaryTextBold}>Subject:</Text> {subject}
              </Text>
            </View>
            <ButtonComponent
              style={styles.options}
              onPress={() => {
                handleShowOptions();
              }}>
              <OptionsIcon width={18} height={28} />
            </ButtonComponent>
            <Animated.View style={styles.accordionButton}>
              <OptionsButtons
                callback={() => handleDeleteChat()}
                icon={<TrashIcon />}
                toValue={!showOptions ? 0 : 0}
                showOptions={showOptions}
              />
              <OptionsButtons
                callback={() => navigateToHome()}
                icon={<HomeIcon />}
                toValue={!showOptions ? -46 : 0}
                showOptions={showOptions}
              />
              <OptionsButtons
                callback={() => handleCopyChatIDToClipboard()}
                icon={<CopyIcon />}
                toValue={!showOptions ? -90 : 0}
                showOptions={showOptions}
              />
            </Animated.View>
          </View>
        </Animated.View>
        <Animated.View style={{ opacity: animatedRef.opacityMessageContainer }}>
          <MessageContainer />
        </Animated.View>

        {showDollTyping && DollTypingAnimated}

        <Animated.View
          style={[styles.footer, { transform: [{ translateY: animatedRef.translateY }] }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTextContainer}
              value={messageText}
              onChangeText={(e) => {
                setMessageText(e);
              }}
            />
            <ButtonComponent
              activeOpacity={0.8}
              onPress={async () => {
                await handleSendMessage();
              }}>
              <SentButtonIcon height={24} width={24} />
            </ButtonComponent>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default ChatContainer;
