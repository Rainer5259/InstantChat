import React, {FC} from 'react';
import Routes from './src/routes';
import Toast from 'react-native-toast-message';
import {Platform, SafeAreaView} from 'react-native';
import colors from './src/components/theme/colors';

const App: FC = () => {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: colors.background.defaultBeige,
        },
        Platform.OS === 'android' && {paddingVertical: 20},
      ]}>
      <Routes />
      <Toast visibilityTime={3000} autoHide topOffset={60} />
    </SafeAreaView>
  );
};

export default App;
