import {StyleSheet} from 'react-native';
import colors from '../../components/theme/colors';
import font from '../../components/theme/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.defaultBeige,
  },
  content: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.background.mintGreen,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderEndStartRadius: 10,
    borderEndEndRadius: 10,
  },
  secondaryButton: {
    backgroundColor: colors.background.mintGreen,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderEndStartRadius: 35,
    borderEndEndRadius: 35,
  },
  buttonContainer: {
    flex: 4,
    paddingHorizontal: 16,
  },
  marginPrimaryButton: {marginBottom: 10},
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
    minWidth: '90%',
    height: 60,
    borderWidth: 0.6,
    borderRadius: 12,
    borderColor: colors.border.lavender,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTextContent: {
    width: '100%',
    height: '1000%',
    textAlign: 'center',
  },
  pastIconBox: {
    flex: 1,
  },
  textInputBox: {
    flex: 9,
    alignItems: 'center',
  },
});
export default styles;
