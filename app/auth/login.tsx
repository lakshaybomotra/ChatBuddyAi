import {TextInput, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import {ThemedView} from "@/components/ThemedView";
import BackButton from "@/components/ui/BackButton";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/HelloWave";
import {useThemedStyles} from "@/hooks/useThemedStyles";
import {icons} from "@/constants/icons";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import CustomButton from "@/components/ui/CustomButton";
import {router} from "expo-router";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {placeholder, text, divider} = useThemedStyles();
    const EmailIcon = icons.email;
    const PasswordIcon = icons.password;
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (email && password) {
            setReady(true);
        } else {
            setReady(true);
        }
    }, [email, password]);

    return (
        <ThemedView className='flex-1 justify-start pt-16 pb-8 px-6'>
            <BackButton/>
            <ThemedView className="justify-center items-start mt-6">
                <ThemedView className="flex-row justify-between items-center gap-4">
                    <ThemedText type='title' className='text-greyscale-900 dark:text-others-white'>
                        Welcome back
                    </ThemedText>
                    <HelloWave/>
                </ThemedView>
                <ThemedText className='text-greyscale-900 dark:text-others-white mt-4'>
                    Please enter your email & password to log in.
                </ThemedText>

                <ThemedView className="w-full mt-8">
                    <ThemedText type='labels' className="font-bold mb-4 text-greyscale-900 dark:text-others-white">
                        Email
                    </ThemedText>
                    <ThemedView className="flex-row items-center border-b border-primary-900 gap-2">
                        <EmailIcon stroke={placeholder} width={28} height={28} className="ml-2"/>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={placeholder}
                            className="flex-1 py-3"
                            cursorColor={text}
                            selectionColor={placeholder}
                            style={{
                                color: text,
                            }}
                        />
                    </ThemedView>
                </ThemedView>

                <ThemedView className="w-full mt-6">
                    <ThemedText type='labels' className="font-bold mb-4 text-greyscale-900 dark:text-others-white">
                        Password
                    </ThemedText>
                    <ThemedView className="flex-row items-center border-b border-primary-900 gap-2">
                        <PasswordIcon stroke={placeholder} width={28} height={28} className="ml-2"/>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor={placeholder}
                            className="flex-1 py-3"
                            cursorColor={text}
                            selectionColor={placeholder}
                            style={{
                                color: text,
                            }}
                        />
                    </ThemedView>
                </ThemedView>

                <ThemedView className="flex-row items-center justify-between mt-6 w-full">
                    <ThemedView className="flex-row items-center gap-4">
                        <CustomCheckbox checked={false} onChange={() => {
                        }}/>
                        <ThemedText type='defaultSemiBold' className="font-bold text-greyscale-900 dark:text-others-white">
                            Remember me
                        </ThemedText>
                    </ThemedView>


                    <TouchableOpacity
                        onPress={() => {
                            console.log("password");
                        }}
                    >
                        <ThemedText type='labels' className="text-primary-900">
                            Forgot Password?
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>

            <ThemedView className="absolute bottom-0 left-0 right-0 pb-9 px-6 border-t" style={{borderColor: divider}}>
                <CustomButton className='mt-6' title="Log In" ready={ready} onPress={() => {
                    router.dismissAll()
                    router.replace('/(tabs)')
                }}/>
                <ThemedView className="flex-row items-center justify-center w-full mt-4">
                    <ThemedText type='defaultSemiBold' className="font-bold text-center text-greyscale-900 dark:text-others-white">
                        Don't have an account?{' '}
                    </ThemedText>
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/auth/register')
                        }}
                    >
                        <ThemedText type='default' className="font-bold text-primary-900 text-center">
                            Sign Up
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}
export default Login
