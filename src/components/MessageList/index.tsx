import React from 'react';
import CryptoJS from 'react-native-crypto-js';
import {View, Text, FlatList} from 'react-native';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import {ChatProps, MessageProps} from '../../types/chat';
import styles from './styles';
import LottieView from 'lottie-react-native';

interface FlatListMessageProps {
  item: MessageProps;
}

const MessageContainer = () => {
  const {message, users}: ChatProps = useSelector(
    (state: RootState) => state.chatDataSlice,
  );

  const RenderMessage = ({item}: FlatListMessageProps) => {
    const decryptedMessage = CryptoJS.AES.decrypt(
      item.content,
      process.env.MESSAGE_CRYPTOGRAPHY_KEY!,
    );
    const sender = item.user_id === users.host_id ? 'Host' : 'Guest';
    const iSender = item.user_id === users.host_id && 'flex-start';
    const originalMessage = decryptedMessage.toString(CryptoJS.enc.Utf8);

    return (
      <View style={[styles.container, iSender && {alignSelf: 'flex-start'}]}>
        <Text style={styles.textHeader}>
          {sender}: ****-{item.user_id.substring(24, 36)}
        </Text>
        <Text style={styles.textHeader}>Date: {item.created_at}</Text>
        <Text style={styles.textContent}>{originalMessage}</Text>
      </View>
    );
  };

  return message.length === 0 ? (
    <LottieView
      source={require('../../assets/json/doll_typing.json')}
      speed={0.4}
      autoPlay
      style={styles.lottieViewContainer}
    />
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
