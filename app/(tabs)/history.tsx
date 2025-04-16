import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import BackButton from "@/components/ui/BackButton";
import { getUserChats } from '@/lib/services/chatService';
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import type { Chat } from "@/lib/services/chatService";

const History = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();

    useEffect(() => {
        loadChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const loadChats = async () => {
        setLoading(true);
        setError(null);
        if (!userId) {
            setChats([]);
            setLoading(false);
            return;
        }
        try {
            const userChats = await getUserChats(userId as string);
            setChats(userChats.filter(chat => !!chat.id));
        } catch (err) {
            setError("Failed to load chats. Please try again.");
            setChats([]);
        }
        setLoading(false);
    };

    return (
        <ThemedView isMain={true} className='flex-1 pt-4 pb-6 px-6'>
            <ThemedView className="flex-row items-center justify-between mb-4">
                <BackButton />
                <ThemedText
                    className='text-greyscale-900 dark:text-others-white'
                    style={{
                        fontSize: 24,
                        lineHeight: 38,
                        textAlign: 'center',
                        fontWeight: '700',
                        flex: 1,
                    }}>
                    Chat History
                </ThemedText>
            </ThemedView>

            {loading ? (
                <ThemedView className="flex-1 justify-center items-center">
                    <ThemedText>Loading chats...</ThemedText>
                </ThemedView>
            ) : error ? (
                <ThemedView className="flex-1 justify-center items-center">
                    <ThemedText className="text-red-500">{error}</ThemedText>
                </ThemedView>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id!}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/chat/${item.id}`)}
                            accessibilityLabel={`Open chat: ${item.title}`}
                            accessible={true}
                            className="p-4 border-b border-greyscale-200 dark:border-dark-4"
                        >
                            <ThemedText className="font-bold text-lg">{item.title}</ThemedText>
                            <ThemedText numberOfLines={1} className="text-sm text-greyscale-600 dark:text-greyscale-400">
                                {item.lastMessage || "No messages yet"}
                            </ThemedText>
                            {item.updatedAt && (
                                <ThemedText className="text-xs text-greyscale-500 mt-1">
                                    {new Date(item.updatedAt).toLocaleString()}
                                </ThemedText>
                            )}
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <ThemedView className="flex-1 justify-center items-center py-10">
                            <ThemedText>No chats yet. Start a new conversation!</ThemedText>
                        </ThemedView>
                    )}
                />
            )}
        </ThemedView>
    );
};

export default History;
