import {StyleSheet} from 'react-native';
import colors from '../../components/theme/colors';
import font from '../../components/theme/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.faintGray,
  },
  content: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: 100,
  },
  button: {
    backgroundColor: colors.background.beige,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonContainer: {
    flex: 4,
    width: '100%',
    paddingHorizontal: 20,
  },
  primaryButton: {marginBottom: 10},
  // @ts-ignore
  title: {
    ...font.style.halveticaBold,
    fontSize: font.size.extraLarge,
  },
  // @ts-ignore
  primaryText: {
    ...font.style.halveticaBold,
  },
  inputTextContainer: {
    textAlign: 'center',
    padding: 12,
    marginBottom: 20,
    minWidth: '80%',
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.border.paleBeigeGray,
  },
});
export default styles;
