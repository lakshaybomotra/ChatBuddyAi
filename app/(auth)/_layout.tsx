import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { View, Text, ActivityIndicator } from 'react-native';
import { PRIMARY_900, ALERT_ERROR } from '@/constants/colors';
import { useState, useEffect } from 'react';

export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkEnvironment = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                setIsLoading(false);
            } catch (err) {
                console.error("Error in auth layout:", err);
                setError("Authentication initialization error");
                setIsLoading(false);
            }
        };
        
        checkEnvironment();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={PRIMARY_900} />
                <Text style={{ marginTop: 20 }}>Loading authentication...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: ALERT_ERROR, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
                <Text style={{ textAlign: 'center' }}>Please restart the app or check your connection.</Text>
            </View>
        );
    }

    if (isSignedIn) {
        return <Redirect href={'/(tabs)'} />
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: 'transparent' }
            }}
        >
            <Stack.Screen
                name="welcome"
                options={{
                    animation: 'fade'
                }}
            />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    )
}
