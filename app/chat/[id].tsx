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
import {sendMessage} from "@/lib/ai";
import {router, useLocalSearchParams} from "expo-router";
import {getAssistantPrompt} from "@/lib/ai/assistantPrompts";
import {saveMessage, getChatMessages, createChat, checkChatExists} from '@/lib/services/chatService';
import {useAuth} from "@clerk/clerk-expo";

const TypingIndicator = () => {
    return (
        <View
            className="flex-row items-center gap-2 p-4 max-w-[20%] bg-greyscale-100 dark:bg-dark-4 rounded-t-xl rounded-br-xl rounded-bl-none">
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{animationDelay: '0ms'}}
            />
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{animationDelay: '200ms'}}
            />
            <View
                className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"
                style={{animationDelay: '400ms'}}
            />
        </View>
    );
};

const Chat = () => {
    const Logo = images.logo;
    const Send = icons.send;
    const {buttonActive, divider, chatBoxType1Text} = useThemedStyles();
    const params = useLocalSearchParams();
    const assistantType = params.assistant as string;
    const assistantDescription = params.description as string;
    const chatId = params.id as string;
    console.log('Chat ID:', chatId);
    const isNewChat = chatId === 'new';
    const {userId} = useAuth();

    const [currentChat, setCurrentChat] = useState<{ id: string, title: string }>({
        id: isNewChat ? '' : chatId,
        title: assistantType || 'ChatBuddy AI'
    });

    const [currentAssistant, setCurrentAssistant] = useState({
        title: assistantType || 'ChatBuddy AI',
        description: assistantDescription || '',
    })

    const [pendingNewChatId, setPendingNewChatId] = useState<string | null>(null);

    const [messages, setMessages] = useState<{ id: string, text: string, sender: 'user' | 'bot' }[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const assistantCapabilities: Record<string, { text: string }[]> = {
        'Write an Article': [
            { text: 'Write well-structured articles on any topic.' },
            { text: 'Ensure clarity and coherence in writing.' },
            { text: 'Adapt tone and style as needed.' },
        ],
        'Academic Writer': [
            { text: 'Compose essays, reports, and academic papers.' },
            { text: 'Cite sources and references properly.' },
            { text: 'Maintain formal academic tone.' },
        ],
        'Summarize (TL;DR)': [
            { text: 'Extract key points from long texts.' },
            { text: 'Provide concise summaries.' },
            { text: 'Highlight main ideas and arguments.' },
        ],
        'Translate Language': [
            { text: 'Translate text between languages.' },
            { text: 'Preserve meaning and context.' },
            { text: 'Support multiple language pairs.' },
        ],
        'Plagiarism Checker': [
            { text: 'Detect copied content in text.' },
            { text: 'Provide originality reports.' },
            { text: 'Suggest ways to improve originality.' },
        ],
        'Songs/Lyrics': [
            { text: 'Write creative song lyrics.' },
            { text: 'Support various music genres.' },
            { text: 'Rhyme and structure verses.' },
        ],
        'Storyteller': [
            { text: 'Create engaging stories.' },
            { text: 'Develop characters and plots.' },
            { text: 'Write in different genres.' },
        ],
        'Poems': [
            { text: 'Compose poems in various styles.' },
            { text: 'Use rhyme and meter creatively.' },
            { text: 'Express emotions through poetry.' },
        ],
        'Movie Script': [
            { text: 'Write scripts for movies.' },
            { text: 'Format dialogues and scenes.' },
            { text: 'Develop story arcs.' },
        ],
        'Email Writer': [
            { text: 'Draft professional emails.' },
            { text: 'Use proper etiquette and tone.' },
            { text: 'Create templates for various scenarios.' },
        ],
        'Answer Interviewer': [
            { text: 'Prepare answers for interview questions.' },
            { text: 'Highlight strengths and experiences.' },
            { text: 'Practice common interview scenarios.' },
        ],
        'Job Post': [
            { text: 'Write clear job descriptions.' },
            { text: 'Highlight required skills and roles.' },
            { text: 'Attract suitable candidates.' },
        ],
        'Advertisements': [
            { text: 'Create catchy ad copy.' },
            { text: 'Promote products or services.' },
            { text: 'Target specific audiences.' },
        ],
        'LinkedIn': [
            { text: 'Write professional LinkedIn posts.' },
            { text: 'Highlight achievements and skills.' },
            { text: 'Engage with professional audience.' },
        ],
        'Instagram': [
            { text: 'Write creative Instagram captions.' },
            { text: 'Use hashtags effectively.' },
            { text: 'Engage followers with stories.' },
        ],
        'Twitter': [
            { text: 'Craft concise and impactful tweets.' },
            { text: 'Use trending hashtags.' },
            { text: 'Engage with followers.' },
        ],
        'TikTok': [
            { text: 'Write viral TikTok captions.' },
            { text: 'Suggest creative video ideas.' },
            { text: 'Engage with trends.' },
        ],
        'Facebook': [
            { text: 'Write engaging Facebook posts.' },
            { text: 'Promote events and pages.' },
            { text: 'Interact with community.' },
        ],
        'Write Code': [
            { text: 'Write code in any programming language.' },
            { text: 'Solve coding problems.' },
            { text: 'Provide code explanations.' },
        ],
        'Explain Code': [
            { text: 'Explain complex code snippets.' },
            { text: 'Break down logic step by step.' },
            { text: 'Suggest improvements.' },
        ],
        'Birthday': [
            { text: 'Write heartfelt birthday wishes.' },
            { text: 'Personalize messages for loved ones.' },
            { text: 'Suggest gift ideas.' },
        ],
        'Apology': [
            { text: 'Write sincere apologies.' },
            { text: 'Express empathy and understanding.' },
            { text: 'Offer ways to make amends.' },
        ],
        'Invitation': [
            { text: 'Draft invitations for any event.' },
            { text: 'Set the right tone and details.' },
            { text: 'Personalize for recipients.' },
        ],
        'Create Conversation': [
            { text: 'Create conversation templates.' },
            { text: 'Support multiple participants.' },
            { text: 'Vary tone and context.' },
        ],
        'Tell a Joke': [
            { text: 'Tell funny jokes.' },
            { text: 'Use puns and wordplay.' },
            { text: 'Lighten the mood.' },
        ],
        'Food Recipes': [
            { text: 'Suggest recipes for any cuisine.' },
            { text: 'List ingredients and steps.' },
            { text: 'Offer cooking tips.' },
        ],
        'Diet Plan': [
            { text: 'Create personalized diet plans.' },
            { text: 'Consider dietary preferences.' },
            { text: 'Suggest healthy meal options.' },
        ],
    };

    const capabilities =
        assistantType && assistantCapabilities[assistantType]
            ? assistantCapabilities[assistantType]
            : [
                { text: 'Answer all your questions. \n(Just ask me anything you like!)' },
                { text: 'Generate all the text you want.\n (essays, articles, reports, stories, & more)' },
                { text: 'Conversational AI.\n (I can talk to you like a natural human)' },
            ];

    useEffect(() => {
        const initChat = async () => {
            if (isNewChat) {
                try {
                    const assistantTitle = assistantType || 'ChatBuddy AI';
                    const assistantDesc = assistantDescription || '';
                    
                    const newChat = await createChat(
                        assistantTitle,
                        assistantTitle,
                        assistantDesc,
                        String(userId)
                    );

                    if (newChat && newChat.id) {
                        setCurrentChat({
                            id: newChat.id,
                            title: assistantTitle
                        });

                        setCurrentAssistant({
                            title: assistantTitle,
                            description: assistantDesc
                        });

                        setPendingNewChatId(newChat.id);
                        setIsInitializing(false);
                    } else {
                        console.error('Error creating new chat');
                        setIsInitializing(false);
                    }
                } catch (error) {
                    console.error('Error initializing chat:', error);
                    setIsInitializing(false);
                }
            } else {
                try {
                    const chatDoc = await checkChatExists(chatId);
                    console.log(chatDoc);
                    if (chatDoc) {
                        loadChatHistory();
                        
                        if (assistantType) {
                            setCurrentAssistant({
                                title: assistantType,
                                description: assistantDescription || ''
                            });
                        }
                        setIsInitializing(false);
                    } else {
                        console.error("Chat doesn't exist or doesn't belong to user");
                        router.replace('/');
                        setIsInitializing(false);
                    }
                } catch (error) {
                    console.error("Error checking chat:", error);
                    setIsInitializing(false);
                }
            }
        };

        if(userId) {
            initChat();
        }
    }, [userId, assistantType, assistantDescription]);

    useEffect(() => {
        if (currentChat.id && !isNewChat) {
            loadChatHistory();
        }
    }, [currentChat.id]);

    const effectiveChatId = isNewChat && pendingNewChatId ? pendingNewChatId : currentChat.id;

    const loadChatHistory = async () => {
        if (!effectiveChatId || !userId) return;

        try {
            const chatMessages = await getChatMessages(
                String(effectiveChatId),
                String(userId)
            );
            if (chatMessages.length > 0) {
                setMessages(chatMessages.map(msg => ({
                    id: msg.id || Date.now().toString(),
                    text: msg.text,
                    sender: msg.sender
                })));
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !effectiveChatId || !userId) return;

        const newUserMessage = {
            text: inputText,
            sender: 'user' as const,
            timestamp: new Date().toISOString()
        };

        const tempUIMessage = {
            id: Date.now().toString(),
            ...newUserMessage
        };

        setMessages(prev => [...prev, tempUIMessage]);

        setInputText("");
        setIsLoading(true);

        try {
            await saveMessage(effectiveChatId, newUserMessage, String(userId));

            // Gemini does NOT support 'system' role. Prepend system prompt as first user message.
            const systemPromptText = getAssistantPrompt(currentAssistant.title, currentAssistant.description);

            const formattedMessages = [
                {
                    role: 'user',
                    content: systemPromptText
                },
                ...messages.concat(tempUIMessage).map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                }))
            ];

            const aiResponse = await sendMessage(formattedMessages);

            const botMessage = {
                text: aiResponse,
                sender: 'bot' as const,
                timestamp: new Date().toISOString()
            };

            const tempUIBotMessage = {
                id: (Date.now() + 1).toString(),
                ...botMessage
            };
            setMessages(prev => [...prev, tempUIBotMessage]);

            await saveMessage(effectiveChatId, botMessage, String(userId));

        } catch (error: any) {
            console.error("Error in chat flow:", error);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: `Error: ${error.message || "Failed to get response"}`,
                sender: 'bot' as const
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollViewRef.current && messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
        }
    }, [messages]);

    if (isInitializing) {
        return (
            <ThemedView isMain={true} className="flex-1 justify-center items-center">
                <ThemedText>Loading chat...</ThemedText>
            </ThemedView>
        );
    }

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
                    {currentAssistant.title}
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
                contentContainerStyle={{paddingBottom: 100}}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message) => (
                    <ChatBubble
                        message={message.text}
                        key={message.id}
                        isSender={message.sender === 'user'}
                        assistantType={message.sender === 'bot' ? currentAssistant.title : undefined}
                    />
                ))}
                {isLoading && <TypingIndicator/>}
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
