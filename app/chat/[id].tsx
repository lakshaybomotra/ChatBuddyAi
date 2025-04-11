import {ScrollView} from 'react-native'
import React from 'react'
// import {useLocalSearchParams} from "expo-router";
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

const Chat = () => {
    // const {id} = useLocalSearchParams();
    const Logo = images.logo;
    const Send = icons.send;
    const {buttonActive, divider, chatBoxType1Text} = useThemedStyles();

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

    const chatMessages = [
        {
            id: 1,
            text: 'What is the capital of France?',
            sender: 'user',
        },
        {
            id: 2,
            text: 'The capital of France is Paris.',
            sender: 'bot',
        },
        {
            id: 3,
            text: 'Can you tell me more about Paris?',
            sender: 'user',
        },
        {
            id: 4,
            text: 'Paris is the capital and most populous city of France. It is known for its art, fashion, and culture.',
            sender: 'bot',
        },
        {
            id: 5,
            text: 'What are some famous landmarks in Paris?',
            sender: 'user',
        },
        {
            id: 6,
            text: 'Some famous landmarks in Paris include the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.',
            sender: 'bot',
        },
        {
            id: 7,
            text: 'Can you recommend some good restaurants in Paris?',
            sender: 'user',
        },
        {
            id: 8,
            text: 'Sure! Some popular restaurants in Paris are Le Meurice, L\'Atelier de Joël Robuchon, and Le Train Bleu.',
            sender: 'bot',
        },
        {
            id: 9,
            text: 'What is the best time to visit Paris?',
            sender: 'user',
        },
        {
            id: 10,
            text: 'The best time to visit Paris is during the spring (March to May) and fall (September to November) when the weather is mild and the crowds are smaller.',
            sender: 'bot',
        },
        {
            id: 11,
            text: 'Can you help me plan a trip to Paris?',
            sender: 'user',
        },
        {
            id: 12,
            text: 'Of course! I can help you with itinerary suggestions, hotel recommendations, and more.',
            sender: 'bot',
        },
    ]

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
                !chatMessages.length && (
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
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {chatMessages.map((message) => (
                    <ChatBubble
                        message={message.text}
                        key={message.id}
                        isSender={message.sender === 'user'}
                    />
                ))}
            </ScrollView>


            <ThemedView className="absolute bottom-0 left-0 right-0 pb-9 px-6 border-t" style={{borderColor: divider}}>
                <ThemedView className='mt-6 w-full flex-row items-center gap-4'>
                    <ThemedInput/>

                    <CustomButton style={{
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
                    }} type='primary' ready={false}>
                        <Send fill={buttonActive} width={28} height={28}/>
                    </CustomButton>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}
export default Chat
