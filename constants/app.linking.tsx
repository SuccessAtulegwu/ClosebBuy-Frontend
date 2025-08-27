import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
//import * as IntentLauncher from 'expo-intent-launcher';


 export const OpenAppLink = (url:string,appName:string,webUrl:string) => {
    Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Error", `${appName} is not installed on your device. ${url}`);
      } else {
        return Linking.openURL(url);
      }
    }).catch((err) => Alert.alert("Error", "An unexpected error occurred."));
  };

/*  export const openWhatsAppWithIntent = async () => {
    const packageName = "whatsapp"; // WhatsApp package name
    IntentLauncher.startActivityAsync("android.intent.action.MAIN", {
      category: "android.intent.category.LAUNCHER",
      packageName,
    }).catch((err) => console.error("Error launching WhatsApp:", err));
  }; */