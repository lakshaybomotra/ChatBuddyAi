import React, {useEffect, useState} from 'react';
import {Keyboard, TextInput, TextInputProps} from 'react-native';
import {ThemedView} from "@/components/ThemedView";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import {PRIMARY_900, TRANSPARENT_GREEN} from "@/constants/colors";

type ThemedInputProps = TextInputProps & {
    placeholder?: string;
};

const ThemedInput: React.FC<ThemedInputProps> = ({placeholder = 'Ask me anything...', ...props}) => {
    const [focused, setFocused] = useState(false);
    const {inputBg, text, placeholder: placeHolderTextColor} = useThemedStyles()
    const [value, setValue] = useState('');


    useEffect(() => {
        const keyboardListener = Keyboard.addListener('keyboardDidHide', () => setFocused(false));
        const keyboardListener2 = Keyboard.addListener('keyboardDidShow', () => setFocused(true));
        return () => {
            keyboardListener.remove();
            keyboardListener2.remove();
        }
    }, []);

    return (

        <ThemedView
            style={{
                flex: 1,
                backgroundColor: focused ? TRANSPARENT_GREEN : inputBg,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 8,
                borderColor: PRIMARY_900,
                borderWidth: focused ? 1 : 0,
            }}
        >
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
                autoCapitalize="none"
                multiline={true}
                scrollEnabled={true}
                placeholderTextColor={placeHolderTextColor}
                className="flex-1 text-base w-full"
                cursorColor={text}
                selectionColor={placeholder}
                style={{
                    color: text,
                    maxHeight: 100
                }}
                {...props}
            />
        </ThemedView>
    );
};

export default ThemedInput;
