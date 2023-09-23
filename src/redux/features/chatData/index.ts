import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {ChatProps} from '.types/chat';

const initialState: ChatProps = {
  chat_id: '',
  created_at: '',
  message: [],
  subject: '',
  updated_at: '',
  users: {host_id: '', guest_id: ''},
  users_limit_per_chat: 0,
};

export const chatDataSlice = createSlice({
  name: 'chat_data',
  initialState,
  reducers: {
    setChatData: (state, action: PayloadAction<ChatProps>) => {
      return {...state, ...action.payload};
    },
  },
});

export const {setChatData} = chatDataSlice.actions;

export default chatDataSlice;
