import {configureStore} from '@reduxjs/toolkit';
import {chatDataSlice} from './features/chatData';

const store = configureStore({
  reducer: {
    chatDataSlice: chatDataSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
