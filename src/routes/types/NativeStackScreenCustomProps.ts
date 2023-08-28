import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from './RootStackParamList';

type HomeScreenCustomProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type ChatScreenCustomProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export type {HomeScreenCustomProps, ChatScreenCustomProps};
