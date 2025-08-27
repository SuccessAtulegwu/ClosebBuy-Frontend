import React, { useContext, useState } from 'react';
import {
    TextInput,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons'; // make sure to install @expo/vector-icons
import { ThemeContext } from '@/context/ThemeContext';
import { ThemedView } from './ThemedView';
import { fontFamilies, fontSizes } from '@/constants/app.constants';

type PasswordInputProps = {
    control: any
    name: any
    placeholder: any
    rules: {}
}

export function PasswordInput({ control, name, placeholder, rules = {} }: PasswordInputProps) {
    const [secureText, setSecureText] = useState(true);
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <ThemedView style={{ marginBottom: 20 }}>
                    <ThemedView
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: error ? 'red' : '#ccc',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            marginBottom: 10,
                        }}
                    >
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor={theme.text}
                            secureTextEntry={secureText}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="none"
                            style={{
                                flex: 1,
                                height: 48,
                                fontSize: fontSizes.FONT18,
                                backgroundColor: theme.background,
                                fontFamily: fontFamilies.NunitoSemiBold,
                                color: theme.text,
                            }}
                        />
                        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                            <Ionicons
                                name={secureText ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                    {error && <Text style={{ color: 'red', marginTop: 5 }}>{error.message}</Text>}
                </ThemedView>
            )}
        />
    );
};

