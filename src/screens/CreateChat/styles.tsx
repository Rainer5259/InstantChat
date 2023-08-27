import {StyleSheet} from 'react-native';
import colors from '../../components/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.faintGray,
  },
  primaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInstantChat: {
    color: colors.text.skyBlue,
    textShadowColor: colors.shadowColor.darkSlateGray,
    textShadowOffset: {height: 20, width: 10},
    textShadowRadius: 50,
  },
  inputTextContainer: {
    padding: 15,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: '5%',
    width: '80%',
    height: '8%',
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.border.paleBeigeGray,
  },
  button: {
    justifyContent: 'center',
    alignContent: 'center',
  },
});
export default styles;
