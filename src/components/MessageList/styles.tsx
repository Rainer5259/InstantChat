import {StyleSheet} from 'react-native';
import font from '../theme/font';
import colors from '../theme/colors';

const styles = StyleSheet.create({
  lottieViewContainer: {
    flex: 1,
    opacity: 0.3,
  },
  container: {
    backgroundColor: colors.background.periwinkle,
    maxWidth: '70%',
    maxHeight: 600,
    borderRadius: 12,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 25,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 30,
    marginVertical: 6,
  },
  textHeader: {
    fontSize: font.size.light,
    fontFamily: 'poppins',
    textAlign: 'right',
  },
  textContent: {
    marginTop: 6,
    color: colors.text.black,
    fontFamily: font.family.sansation,
    alignSelf: 'flex-end',
    textAlign: 'right',
    fontWeight: '700',
  },
  primaryTextBold: {
    fontWeight: '700',
    fontSize: font.size.small,
    paddingHorizontal: 8,
  },
  letsTalk: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default styles;
