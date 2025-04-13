import {ScrollView, View} from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import BackButton from "@/components/ui/BackButton";
import CapabilityBox from "@/components/ui/CapabilityBox";
import {images} from "@/constants/images";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import CustomButton from "@/components/ui/CustomButton";
import ThemedInput from "@/components/ThemedInput";
import {icons} from "@/constants/icons";
import ChatBubble from "@/components/ui/ChatBubble";
import { sendMessage } from "@/lib/ai";

// Add TypingIndicator component at the top level
const TypingIndicator = () => {
    return (
        <View className="flex-row items-center gap-2 p-4 max-w-[20%] bg-greyscale-100 dark:bg-dark-4 rounded-t-xl rounded-br-xl rounded-bl-none">
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{ animationDelay: '0ms' }}
            />
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{ animationDelay: '200ms' }}
            />
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{ animationDelay: '400ms' }}
            />
        </View>
    );
};

const Chat = () => {
    const Logo = images.logo;
    const Send = icons.send;
    const {buttonActive, divider, chatBoxType1Text} = useThemedStyles();

    // Add state for messages and input
    const [messages, setMessages] = useState<{id: number, text: string, sender: 'user' | 'bot'}[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const capabilities = [
        {
            text: 'Answer all your questions. \n(Just ask me anything you like!)',
        },
        {
            text: 'Generate all the text you want.\n (essays, articles, reports, stories, & more)',
        },
        {
            text: 'Conversational AI.\n (I can talk to you like a natural human)',
        },
    ]

    // Function to handle sending messages
    const handleSend = async () => {
        if (!inputText.trim()) return;

        // Create new message and add to state
        const newUserMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user' as const
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            // Format messages for AI
            const formattedMessages = messages.concat(newUserMessage).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            // Get AI response
            const aiResponse = await sendMessage(formattedMessages);

            // Add AI response to chat
            const botMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot' as const
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            console.error("Error getting AI response:", error);

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                text: `Error: ${error.message || "Failed to get response"}`,
                sender: 'bot' as const
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (scrollViewRef.current && messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
        }
    }, [messages]);

    return (
        <ThemedView isMain={true} className='flex-1 pt-4 pb-6 px-6'>
            <ThemedView className="flex-row items-center justify-between">
                <BackButton/>
                <ThemedText
                    className='text-greyscale-900 dark:text-others-white'
                    style={{
                        fontSize: 24,
                        lineHeight: 38,
                        textAlign: 'center',
                        fontWeight: '700',
                        flex: 1,
                    }}>
                    ChatBuddy AI
                </ThemedText>
            </ThemedView>

            {
                !messages.length && (
                    <ThemedView className="flex items-center justify-center gap-6 mt-6">
                        <Logo fill={divider} width={80} height={80}/>
                        <ThemedText type='title'
                                    className='text-greyscale-400 dark:text-greyscale-800'>Capabilities</ThemedText>

                        <ThemedView className="w-full items-center gap-3">
                            {
                                capabilities.map((capability, index) => (
                                    <CapabilityBox text={capability.text} key={index}/>
                                ))
                            }
                        </ThemedView>

                        <ThemedText style={{
                            color: chatBoxType1Text,
                        }} type='labels' className='text-base text-center'>
                            I can do much more than this.
                        </ThemedText>
                    </ThemedView>
                )
            }

            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message) => (
                    <ChatBubble
                        message={message.text}
                        key={message.id}
                        isSender={message.sender === 'user'}
                    />
                ))}
                {isLoading && <TypingIndicator />}
            </ScrollView>

            <ThemedView className="absolute bottom-0 left-0 right-0 pb-9 px-6 border-t" style={{borderColor: divider}}>
                <ThemedView className='mt-6 w-full flex-row items-center gap-4'>
                    <ThemedInput
                        value={inputText}
                        onChangeText={setInputText}
                    />

                    <CustomButton
                        style={{
                            width: 55,
                            height: 55,
                            padding: 16,
                            boxShadow: '4px 8px 24px 0px rgba(23, 206, 146, 0.25)',
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                            borderRadius: 100,
                        }}
                        type='primary'
                        ready={!!inputText.trim() && !isLoading}
                        onPress={handleSend}
                    >
                        <Send fill={buttonActive} width={28} height={28}/>
                    </CustomButton>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

export default Chat
