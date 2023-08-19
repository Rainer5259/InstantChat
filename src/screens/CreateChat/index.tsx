import React, {useState} from 'react';
import {View, Text, TextInput, ActivityIndicator} from 'react-native';
import {v4 as uuidV4} from 'uuid';
import {CreateChatScreenCustomProps} from '../../routes/types';

import styles from './styles';
import 'react-native-get-random-values';
import createChat from '../../functions/createChat';
import {setChatData} from '../../redux/features/chatData';
import {useDispatch} from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent';
import {ChatProps} from '../../types/chat';
import Toast from 'react-native-toast-message';

const CreateChat = ({navigation}: CreateChatScreenCustomProps) => {
  const [subject, setSubject] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const generateNewChat = async () => {
    setLoading(true);
    try {
      if (subject.length < 3) {
        setTimeout(() => setLoading(false), 300);
        return Toast.show({
          type: 'error',
          text1: 'Type a subject',
          position: 'top',
        });
      }

      const randomUserUUID: string = uuidV4();
      const randomChatUUID: string = uuidV4();
      const getCurrentDate = new Date().getTime().toString();

      const data: ChatProps = {
        chat_id: randomChatUUID,
        users: {host_id: randomUserUUID, guest_id: ''},
        subject: subject,
        message: [],
        users_limit_per_chat: 2,
        created_at: getCurrentDate,
        updated_at: getCurrentDate,
      };
      await createChat(data);
      dispatch(setChatData(data));

      navigation.reset({
        index: 0,
        routes: [{name: 'Chat', params: {chat_id: randomChatUUID}}],
      });

      setLoading(false);
      return;
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'An error occurred while',
        position: 'top',
      });
    } finally {
      loading && setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={e => setSubject(e)}
        value={subject}
        style={styles.inputTextContainer}
        placeholder="Type the subject with more than 3 characters"
      />
      <ButtonComponent
        onPress={() => {
          generateNewChat();
        }}
        style={styles.button}>
        {loading ? (
          <ActivityIndicator size={24} />
        ) : (
          <Text style={styles.primaryText}>
            Click on me to generate {''}
            <Text style={styles.textInstantChatCustom}>InstantChat</Text>
          </Text>
        )}
      </ButtonComponent>
    </View>
  );
};

export default CreateChat;
