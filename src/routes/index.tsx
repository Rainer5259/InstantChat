import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {Provider} from 'react-redux';

import Home from '~/screens/Home';
import store from '~/redux/store';
import ChatContainer from '~/screens/Chat';

const Stack = createNativeStackNavigator<RootStackParamList>();
console.log(Home);
const Routes = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={ChatContainer} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
export default Routes;
