import {StyleSheet} from 'react-native';
import fontFamily from '../theme/font';
import colors from '../theme/colors';

const styles = StyleSheet.create({
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
    ...fontFamily.roboto.light,
    textAlign: 'right',
  },
  textContent: {
    marginTop: 6,
    ...fontFamily.roboto.medium,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  letsTalk: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default styles;
