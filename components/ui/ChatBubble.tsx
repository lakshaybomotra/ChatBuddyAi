import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { icons } from "@/constants/icons";
import { GREYSCALE_400, GREYSCALE_700 } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import clsx from "clsx";
import Markdown from 'react-native-markdown-display';
import { useThemeColor } from '@/hooks/useThemeColor';

type ChatBubbleProps = {
    message: string;
    isSender?: boolean;
    assistantType?: string;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender = false }) => {
    const Copy = icons.copy;
    const theme = useColorScheme() ?? 'light';
    const textColor = useThemeColor({}, 'text');

    const handleCopy = () => {
        Clipboard.setStringAsync(message);
    };

    const markdownStyles = {
        body: {
            color: isSender ? '#ffffff' : textColor,
        },
        paragraph: {
            marginVertical: 0,
        },
        heading1: {
            fontWeight: '700' as const,
            fontSize: 20,
            marginVertical: 10,
            color: isSender ? '#ffffff' : textColor,
        },
        heading2: {
            fontWeight: '700' as const,
            fontSize: 18,
            marginVertical: 8,
            color: isSender ? '#ffffff' : textColor,
        },
        heading3: {
            fontWeight: '600' as const,
            fontSize: 16,
            marginVertical: 6,
            color: isSender ? '#ffffff' : textColor,
        },
        hr: {
            backgroundColor: '#cccccc',
            height: 1,
            marginVertical: 12,
        },
        list_item: {
            marginVertical: 2,
        },
        strong: {
            fontWeight: '700' as const,
        },
        code_inline: {
            backgroundColor: isSender ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            padding: 4,
            borderRadius: 4,
        },
        code_block: {
            backgroundColor: isSender ? 'rgba(255,255,255,0.2)' : '#f5f5f5',
            padding: 8,
            borderRadius: 4,
        },
        blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: isSender ? '#ffffff' : '#cccccc',
            paddingLeft: 10,
        }
    };

    const rendererRules = {
        image: (_node: any, _children: any, _parent: any, _styles: any) => {
            return null;
        },
    };

    if (isSender) {
        return (
            <View className="bg-primary-900 self-end my-2 max-w-[80%] px-4 py-2 rounded-t-xl rounded-bl-xl rounded-br-none">
                <Markdown style={markdownStyles} rules={rendererRules}>
                    {message}
                </Markdown>
            </View>
        );
    }

    return (
        <View className="relative self-start my-2 max-w-[80%]">
            <View className={clsx(
                "bg-greyscale-100 dark:bg-dark-4 px-4 py-2 rounded-t-xl rounded-br-xl rounded-bl-none"
            )}>
                <Markdown style={markdownStyles} rules={rendererRules}>
                    {message}
                </Markdown>
            </View>

            <View className="absolute top-2 -right-10 flex-col gap-4">
                <TouchableOpacity onPress={handleCopy}>
                    <Copy fill={theme === 'dark' ? GREYSCALE_700 : GREYSCALE_400} width={24} height={24} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatBubble;