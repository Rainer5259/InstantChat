import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from '../../store';
import type {ChatProps} from '../../../types/chat/index';

interface ChatDataProps extends ChatProps {}

const initialState: ChatDataProps = {
  chat_id: '',
  created_at: '',
  message: [],
  subject: '',
  updated_at: '',
  users: {host_id: '', guest_id: ''},
  users_limit_per_chat: 2,
};

export const chatDataSlice = createSlice({
  name: 'chat_data',
  initialState,
  reducers: {
    setChatData: (state, action: PayloadAction<ChatDataProps>) => {
      return {...state, ...action.payload};
    },
  },
});

export const {setChatData} = chatDataSlice.actions;

export default chatDataSlice;
