import React from 'react';
import Routes from './src/routes';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native';
import colors from './src/components/theme/colors';

const App: JSX.ElementType = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background.defaultBeige,
      }}>
      <Routes />
      <Toast visibilityTime={3000} autoHide topOffset={60} />
    </SafeAreaView>
  );
};

export default App;
