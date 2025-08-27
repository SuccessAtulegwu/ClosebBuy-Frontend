import { DimensionValue, Dimensions, PixelRatio, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;

export const IsIOS = Platform.OS === "ios";
export const IsIPAD = IsIOS && SCREEN_HEIGHT / SCREEN_WIDTH < 1.6;
export const IsAndroid = Platform.OS === "android";
export const IsHaveNotch = IsIOS && SCREEN_HEIGHT > 750;
export const hasNotch = Platform.OS === "ios" && getStatusBarHeight() > 20;
export const Isiphone12promax = IsIOS && SCREEN_HEIGHT > 2778;
export const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
export const CACHED_IMAGES = 'cachedAssets';
export const API_URL = 'https://teamechofluxservices.onrender.com/';

export const windowHeight = (height: DimensionValue): number => {
  if (!height) {
    return 0;
  }
  let tempHeight = SCREEN_HEIGHT * (parseFloat(height.toString()) / 667);
  return PixelRatio.roundToNearestPixel(tempHeight);
};

export const windowWidth = (width: DimensionValue): number => {
  if (!width) {
    return 0;
  }
  let tempWidth = SCREEN_WIDTH * (parseFloat(width.toString()) / 480);
  return PixelRatio.roundToNearestPixel(tempWidth);
};


export const SEEN_BOARDING_SCREEN = 'hasSeenOnboarding';
export const TOKEN_KEY = 'authToken';
export const USER_STORAGE_KEY = 'userDetails';

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;

export const fullnameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*\s[A-Za-zÀ-ÖØ-öø-ÿ]+([-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
export const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
export const userNameRegex = /^(?!\d+$)[a-z0-9_]+$/;
export const fontSizes = {
  FONT6: windowWidth(6),
  FONT7: windowWidth(7),
  FONT8: windowWidth(8),
  FONT9: windowWidth(9),
  FONT10: windowWidth(10),
  FONT11: windowWidth(11),
  FONT12: windowWidth(12),
  FONT13: windowWidth(13),
  FONT14: windowWidth(14),
  FONT15: windowWidth(15),
  FONT16: windowWidth(16),
  FONT17: windowWidth(17),
  FONT18: windowWidth(18),
  FONT19: windowWidth(19),
  FONT20: windowWidth(20),
  FONT21: windowWidth(21),
  FONT22: windowWidth(22),
  FONT23: windowWidth(23),
  FONT24: windowWidth(24),
  FONT25: windowWidth(25),
  FONT26: windowWidth(26),
  FONT27: windowWidth(27),
  FONT28: windowWidth(28),
  FONT30: windowWidth(30),
  FONT32: windowWidth(32),
  FONT35: windowWidth(35),
};

export const fontFamilies = {
  NunitoBold: 'Inter-Bold',
  NunitoSemiBold: 'Inter-SemiBold',
  NunitoRegular: 'Roboto-Regular',
  NunitoLight: 'Roboto-Light',
}


