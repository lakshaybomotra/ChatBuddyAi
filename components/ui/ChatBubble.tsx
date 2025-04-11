import React from 'react';
import { Text, View, TouchableOpacity, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { icons } from "@/constants/icons";
import { GREYSCALE_400, GREYSCALE_700 } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import clsx from "clsx";

type ChatBubbleProps = {
    message: string;
    isSender?: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender = false }) => {
    const Copy = icons.copy;
    const ShareIcon = icons.share;
    const theme = useColorScheme() ?? 'light';

    const handleCopy = () => {
        Clipboard.setStringAsync(message);
    };

    const handleShare = async () => {
        try {
            await Share.share({ message });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const shouldShowIcon = message.length > 120; // tweak this threshold

    if (!isSender) {
        return (
            <View className="relative self-start my-2 max-w-[80%]">
                <View className={clsx(
                    "bg-greyscale-100 dark:bg-dark-4 px-4 py-2 rounded-t-xl rounded-br-xl rounded-bl-none"
                )}>
                    <Text className="text-base text-greyscale-900 dark:text-others-white">
                        {message}
                    </Text>
                </View>

                <View className="absolute top-2 -right-10 flex-col gap-4">
                    <TouchableOpacity onPress={handleCopy}>
                        <Copy fill={theme === 'dark' ? GREYSCALE_700 : GREYSCALE_400} width={24} height={24} />
                    </TouchableOpacity>

                    {
                        shouldShowIcon && (
                            <TouchableOpacity onPress={handleShare}>
                                <ShareIcon fill={theme === 'dark' ? GREYSCALE_700 : GREYSCALE_400} />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        );
    }

    return (
        <View className="bg-primary-900 self-end my-2 max-w-[80%] px-4 py-2 rounded-t-xl rounded-bl-xl rounded-br-none">
            <Text className="text-base text-others-white">{message}</Text>
        </View>
    );
};

export default ChatBubble;
