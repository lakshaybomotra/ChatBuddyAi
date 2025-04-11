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

const Register = () => {
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
            setReady(false);
        }
    }, [email, password]);

    return (
        <ThemedView className='flex-1 justify-start pt-16 pb-8 px-6'>
            <BackButton/>
            <ThemedView className="justify-center items-start mt-6">
                <ThemedView className="flex-row justify-between items-center gap-4">
                    <ThemedText type='title' className='text-greyscale-900 dark:text-others-white'>
                        Hello there
                    </ThemedText>
                    <HelloWave/>
                </ThemedView>
                <ThemedText className='mt-4 text-5xl text-greyscale-900 dark:text-others-white'>
                    Please enter your email & password to create an account.
                </ThemedText>

                <ThemedView className="w-full mt-8">
                    <ThemedText type='labels' className="text-base font-bold mb-4 text-greyscale-900 dark:text-others-white">
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
                    <ThemedText type='labels' className="text-base font-bold mb-4 text-greyscale-900 dark:text-others-white">
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

                <ThemedView className="flex-row items-center mt-6 gap-4">
                    <CustomCheckbox checked={false} onChange={() => {
                    }}/>
                    <ThemedText type='defaultSemiBold' className="text-base font-bold text-greyscale-900 dark:text-others-white">
                        I agree to ChatBuddy's{' '}
                        <ThemedText type='defaultSemiBold' className="font-bold text-primary-900" onPress={() => {
                            router.navigate('/auth/login')
                        }
                        }>
                            Terms & Privacy Policy
                        </ThemedText>
                    </ThemedText>
                </ThemedView>

                {/*<ThemedView className="w-full h-[1px] my-8" style={{backgroundColor: divider}}/>*/}


            </ThemedView>

            <ThemedView className="absolute bottom-0 left-0 right-0 pb-9 px-6 border-t" style={{ borderColor: divider}}>
                <CustomButton className='mt-6' title="Sign Up" ready={ready} onPress={() => {
                    console.log("Sign Up");
                }}/>

                <ThemedView className="flex-row items-center justify-center w-full mt-4">
                    <ThemedText type='defaultSemiBold' className="font-bold text-center text-greyscale-900 dark:text-others-white">
                        Already have an account?{' '}
                    </ThemedText>
                    <TouchableOpacity
                        onPress={() => {
                            router.replace('/auth/login')
                        }}
                    >
                        <ThemedText type='default' className="font-bold text-primary-900 text-center">
                            Log In
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>

        </ThemedView>
    )
}
export default Register
