import React from 'react';
import Routes from './src/routes';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native';

const App: JSX.ElementType = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Routes />
      <Toast visibilityTime={3000} autoHide topOffset={60} />
    </SafeAreaView>
  );
};

export default App;
