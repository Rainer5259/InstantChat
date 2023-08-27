import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {Provider} from 'react-redux';

import CreateChat from '../screens/CreateChat';
import Chat from '../screens/Chat';
import store from '../redux/store';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <Stack.Screen name="CreateChat" component={CreateChat} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
export default Routes;
