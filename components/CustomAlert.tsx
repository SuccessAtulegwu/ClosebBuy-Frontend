import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { fontFamilies } from '@/constants/app.constants';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose?: () => void;
}

export function CustomAlert({
  visible,
  type = 'info',
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: CustomAlertProps) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          iconColor: '#4CAF50',
          backgroundColor: '#4CAF5015',
        };
      case 'error':
        return {
          icon: 'close-circle',
          iconColor: '#ff4757',
          backgroundColor: '#ff475715',
        };
      case 'warning':
        return {
          icon: 'warning',
          iconColor: '#FFA726',
          backgroundColor: '#FFA72615',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle',
          iconColor: '#2196F3',
          backgroundColor: '#2196F315',
        };
    }
  };

  const config = getAlertConfig();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return [styles.button, styles.cancelButton];
      case 'destructive':
        return [styles.button, styles.destructiveButton];
      default:
        return [styles.button, styles.defaultButton];
    }
  };

  const getButtonTextStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return [styles.buttonText, styles.cancelButtonText];
      case 'destructive':
        return [styles.buttonText, styles.destructiveButtonText];
      default:
        return [styles.buttonText, styles.defaultButtonText];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.alertContainer}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.backgroundColor },
            ]}
          >
            <Ionicons name={config.icon as any} size={48} color={config.iconColor} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={getButtonStyle(button.style)}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.7}
              >
                <Text style={getButtonTextStyle(button.style)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    alertContainer: {
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 24,
      width: width - 60,
      maxWidth: 400,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
      fontFamily: fontFamilies.NunitoBold,
    },
    message: {
      fontSize: 16,
      color: theme.tabIconDefault,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 24,
      fontFamily: fontFamilies.NunitoRegular,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    defaultButton: {
      backgroundColor: theme.accent,
    },
    cancelButton: {
      backgroundColor: theme.cardcolor,
      borderWidth: 1,
      borderColor: theme.tabIconDefault + '30',
    },
    destructiveButton: {
      backgroundColor: '#ff4757',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    defaultButtonText: {
      color: '#fff',
    },
    cancelButtonText: {
      color: theme.text,
    },
    destructiveButtonText: {
      color: '#fff',
    },
  });
}

