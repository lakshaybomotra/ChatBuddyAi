// @ts-ignore
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from "expo-router";
import {StatusBar} from 'expo-status-bar';
import './globals.css';
import {useColorScheme} from '@/hooks/useColorScheme';
import {ClerkProvider} from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    {/*<Stack.Screen name="auth/welcome" options={{headerShown: false,}}/>*/}
                    {/*<Stack.Screen name="auth/login" options={{headerShown: false,}}/>*/}
                    {/*<Stack.Screen name="auth/register" options={{headerShown: false,}}/>*/}
                    <Stack.Screen name="chat/[id]" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                </Stack>
                <StatusBar style="auto"/>
            </ThemeProvider>
        </ClerkProvider>
    )
}