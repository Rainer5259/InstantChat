import {StyleSheet} from 'react-native';
import colors from '../../components/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.beige,
  },
  opacityView: {backgroundColor: colors.opacityRGBA.beigeGray},
  messageContainer: {
    backgroundColor: colors.background.beigeGray,
    width: '70%',
    maxHeight: 600,
    borderRadius: 12,
    alignSelf: 'flex-end',
    padding: 8,
    marginRight: 30,
    marginVertical: 4,
  },
  messageText: {
    fontSize: 14,
    color: colors.text.black,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  inputTextContainer: {
    padding: 14,
    alignSelf: 'center',
    width: '80%',
    height: 44,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.border.paleBeigeGray,
  },

  footerAlignment: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectAlignment: {
    alignSelf: 'flex-start',
    height: 60,
    justifyContent: 'space-evenly',
  },

  sendButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderStartEndRadius: 90,
    borderEndEndRadius: 90,
    borderTopStartRadius: 30,
    borderRadius: 1,
    backgroundColor: colors.background.beigeGray,
  },
  clipboardButton: {
    height: 30,
    backgroundColor: colors.opacityRGBA.beigeGray,
    borderRadius: 12,
    justifyContent: 'center',
  },
  primaryTextBold: {
    fontWeight: '800',
    paddingHorizontal: 8,
  },
  textPadding: {
    paddingHorizontal: 8,
  },
});
export default styles;
