import { StyleSheet } from 'react-native';
import colors from '~/shared/theme/colors';
import fontFamily from '~/shared/theme/font';

const styles = StyleSheet.create({
  geometryBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  lottieViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    opacity: 0.3,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background.defaultBeige,
  },

  content: { flex: 9 },

  inputTextContainer: {
    paddingHorizontal: 8,
    height: 40,
    flex: 0.95,
  },

  inputContainer: {
    borderWidth: 2.4,
    borderTopLeftRadius: 24,
    borderTopEndRadius: 24,
    borderColor: colors.border.cornflowerBlue,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    height: 70,
  },

  clipboardButton: {
    borderEndEndRadius: 12,
    borderStartEndRadius: 12,
    flex: 1,
  },
  headerAlignmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryTextBold: {
    ...fontFamily.roboto.lightBold,
    paddingHorizontal: 8,
    color: colors.text.black,
  },
  textPadding: {
    fontSize: 12,
    paddingHorizontal: 8,
    color: colors.text.black,
  },
  headerChatIDBorder: {
    borderTopRightRadius: 6,
    borderEndEndRadius: 6,
    backgroundColor: colors.opacityRGBA.cottonCandyPink,
    flex: 9,
    justifyContent: 'center',
    marginRight: 10,
    height: 28,
  },
  subjectContainer: {
    flex: 9,
    borderTopRightRadius: 6,
    borderEndEndRadius: 6,
    backgroundColor: colors.opacityRGBA.cottonCandyPink,
    justifyContent: 'center',
    height: 28,
    marginRight: 120,
  },
  options: { flex: 1, marginRight: 10 },
  accordionButton: {
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    right: 10,
    top: 40,
    left: 0,
    position: 'absolute',
  },
});
export default styles;
