import {StyleSheet} from 'react-native';
import colors from '@components/theme/colors';
import fontFamily from '@components/theme/font';

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

  content: {flex: 9},

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
    marginHorizontal: 20,
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
  headerSubjectBorder: {
    borderTopRightRadius: 6,
    borderEndEndRadius: 6,
    backgroundColor: colors.opacityRGBA.cottonCandyPink,
    justifyContent: 'center',
    width: 210,
    height: 28,
  },
});
export default styles;
