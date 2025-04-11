import {Animated, Easing} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {router} from "expo-router";
import {images} from "@/constants/images";
import {ThemedView} from "@/components/ThemedView";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import {ThemedText} from "@/components/ThemedText";

const Index = () => {
    const Logo = images.logo;
    const Loader = images.loader;

    const spinValue = useRef(new Animated.Value(0)).current;
    const {buttonActive} = useThemedStyles();

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Simulate fetching data
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.replace('/auth/welcome');
        };

        fetchData();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <ThemedView className='flex-1 justify-center items-center'>
            <Logo fill={buttonActive} width={160} height={160}/>
            <ThemedText className='text-5xl text-greyscale-900 dark:text-others-white pt-8'>ChatBuddy AI</ThemedText>
            <Animated.View style={{transform: [{rotate: spin}], marginTop: 120}}>
                <Loader width={60} height={60}/>
            </Animated.View>
        </ThemedView>
    );
};

export default Index;