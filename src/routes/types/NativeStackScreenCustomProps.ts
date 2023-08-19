import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from './RootStackParamList';

type ChatScreenCustomProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type CreateChatScreenCustomProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateChat'
>;

export type {ChatScreenCustomProps, CreateChatScreenCustomProps};
