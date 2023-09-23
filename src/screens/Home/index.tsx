import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ButtonComponent from '@components/ButtonComponent';
import styles from './styles';
import {ChatProps} from 'types/chat';
import {getDatabase, onValue, ref, set, update} from 'firebase/database';
import {useDispatch} from 'react-redux';
import app from '@services/firebase';
import {v4 as uuidV4} from 'uuid';
import 'react-native-get-random-values';
import {setChatData} from '@redux/features/chatData';
import {HomeContent} from '@utils/enums/screens';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {HomeScreenCustomProps} from '@routes/types/NativeStackScreenCustomProps';
import colors from '@components/theme/colors';
import Logo from '@assets/svg/logo_icon.svg';
import Past from '@assets/svg/past_from_clipboard_icon.svg';
import Clipboard from '@react-native-clipboard/clipboard';
import {uuidV4Pattern} from '@utils/masks';
type UpdatesProps = {[key: string]: string};
type UpdatesUserLimitProps = {[key: string]: number};

const Home = ({navigation}: HomeScreenCustomProps) => {
  const [typeContent, setTypeContent] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [inputLimits, setInputLimits] = useState(0);
  const [inputMaxLength, setInputMaxLength] = useState(0);
  const [isJoinWithID, setIsJoinWithID] = useState<boolean>(true);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateXNegative = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const db = getDatabase(app);

  const formatChatID = (value: string) => {
    const cleanedValue = value.replace(/[^0-9a-fA-F]/g, '');

    const formattedValue = cleanedValue.replace(
      uuidV4Pattern,
      function (_, p1, p2, p3, p4, p5) {
        let result = '';

        if (p1) result += p1 + '-';
        if (p2) result += p2 + '-';
        if (p3) result += p3 + '-';
        if (p4) result += p4 + '-';
        if (p5) result += p5;

        return result;
      },
    );

    setInputValue(formattedValue);
  };

  const content = useMemo(
    () => [
      {
        type: HomeContent.CREATE_CHAT,
        placeholder: 'Subject',

        value: inputValue,
        onPrimaryButtonPress: () => {
          handleCreateChat();
        },
        onSecondaryButtonPress: () => {
          setIsJoinWithID(false);
          setInputValue('');
          setTypeContent(HomeContent.JOIN_WITH_CHAT_ID);
        },
        primaryButtonText: 'Create',
        secondaryButtonText: 'Join with Chat ID',
      },
      {
        type: HomeContent.JOIN_WITH_CHAT_ID,
        onPrimaryButtonPress: () => {
          handleJoinWithChatID();
        },
        onSecondaryButtonPress: () => {
          setInputValue('');
          setTypeContent(HomeContent.CREATE_CHAT);
          setIsJoinWithID(true);
        },
        placeholder: '********-****-****-****-************',
        primaryButtonText: 'Join',
        secondaryButtonText: 'Create Chat',
        icon: <Past />,
      },
    ],
    [typeContent, inputValue],
  );

  const startAnimationTranslateX = (
    animatedValue: Animated.Value,
    toValue: number,
  ) => {
    Animated.timing(animatedValue, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleJoinWithChatID = async () => {
    setLoading(true);
    const randomGuestID: string = uuidV4();
    const setGuestID = () => {
      const data = {guest_id: randomGuestID};
      const updates: UpdatesProps = {};
      const endpoint = '/chats/' + inputValue + '/users/guest_id';
      updates[endpoint] = data.guest_id;
      return update(ref(db), updates);
    };

    const fetchChatsInRealTime = () => {
      const endpoint = ref(db, `chats/${inputValue}/`);
      try {
        onValue(
          endpoint,
          snapshot => {
            const response = snapshot.exists();
            if (response) {
              const data: ChatProps = snapshot.val();
              dispatch(setChatData(data));
              if (data.users.guest_id !== '')
                return Toast.show({
                  type: 'error',
                  text1: 'Limit of users exceeded',
                });

              setGuestID();

              const newUserLimit = {users_limit_per_chat: 2};
              const updates: UpdatesUserLimitProps = {};
              const endpoint = '/chats/' + inputValue + '/users_limit_per_chat';

              updates[endpoint] = newUserLimit.users_limit_per_chat;
              update(ref(db), updates).then(() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Chat',
                      params: {chat_id: inputValue, user_id: randomGuestID},
                    },
                  ],
                });
              });

              return;
            }
            return Toast.show({
              type: 'error',
              text1: 'Invalid ID',
            });
          },
          {onlyOnce: true},
        );
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: 'An error occurred',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchChatsInRealTime();
  };

  const handleCreateChat = async () => {
    setLoading(true);
    try {
      const randomChatUUID: string = uuidV4();
      const getCurrentDate = new Date().getTime().toString();
      const data: ChatProps = {
        chat_id: randomChatUUID,
        users: {host_id: '', guest_id: ''},
        subject: inputValue,
        message: [],
        users_limit_per_chat: 1,
        created_at: getCurrentDate,
        updated_at: getCurrentDate,
      };

      set(ref(db, 'chats/' + randomChatUUID), data);

      dispatch(setChatData(data));

      startAnimationTranslateX(translateX, 400);
      startAnimationTranslateX(translateXNegative, -400);

      setTimeout(
        () =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Chat'}],
          }),
        500,
      );
      return;
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'An error occurred while',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
    return;
  };

  const handlePastFromClipboard = async () => {
    let clipboardContent = await Clipboard.getString();

    if (
      (clipboardContent.length < 32 && !uuidV4Pattern.test(clipboardContent)) ||
      clipboardContent.length === 0
    ) {
      return Toast.show({type: 'error', text1: 'Chat ID Invalid!'});
    } else {
      formatChatID(clipboardContent);
    }
    return Toast.show({type: 'success', text1: 'Pasted', text2: inputValue});
  };

  useEffect(() => {
    switch (typeContent) {
      case HomeContent.CREATE_CHAT:
        setInputLimits(3);
        setInputMaxLength(20);
        break;
      case HomeContent.JOIN_WITH_CHAT_ID:
        setInputMaxLength(36);
        setInputLimits(36);
        break;
      default:
        break;
    }
  }, [typeContent]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <Logo height={240} width={240} />
        <Animated.View style={{transform: [{translateX: translateXNegative}]}}>
          <View style={styles.inputTextContainer}>
            <View style={styles.textInputBox}>
              <TextInput
                onChangeText={e =>
                  typeContent === HomeContent.CREATE_CHAT
                    ? setInputValue(e)
                    : formatChatID(e)
                }
                value={inputValue}
                placeholder={content[typeContent].placeholder}
                maxLength={inputMaxLength}
                style={styles.inputTextContent}
              />
            </View>
            <ButtonComponent
              style={[styles.pastIconBox, isJoinWithID && {flex: 0}]}
              onPress={() => handlePastFromClipboard()}>
              {content[typeContent].icon && content[typeContent].icon}
            </ButtonComponent>
          </View>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {transform: [{translateX: translateX}]},
        ]}>
        <View style={styles.marginPrimaryButton}>
          <ButtonComponent
            onPress={() => content[typeContent].onPrimaryButtonPress()}
            style={[
              styles.primaryButton,
              inputValue.length < inputLimits && {opacity: 0.6},
            ]}
            disabled={inputValue.length < inputLimits && true}
            activeOpacity={0.6}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={[styles.primaryText, {color: colors.text.indigo}]}>
                {content[typeContent].primaryButtonText}
              </Text>
            )}
          </ButtonComponent>
        </View>
        <ButtonComponent
          onPress={() => content[typeContent].onSecondaryButtonPress()}
          style={styles.secondaryButton}
          activeOpacity={0.6}>
          <Text style={styles.primaryText}>
            {content[typeContent].secondaryButtonText}
          </Text>
        </ButtonComponent>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Home;
