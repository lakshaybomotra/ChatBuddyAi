import {Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {ThemedView} from "@/components/ThemedView";
import {useClerk} from "@clerk/clerk-expo";
import {router} from "expo-router";

const Account = () => {
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.replace('/(auth)/welcome')
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <ThemedView className='flex-1 justify-start pt-16 pb-8 px-6'>

        <TouchableOpacity onPress={handleSignOut} className='flex-row items-center justify-center w-full h-12 bg-primary-900 rounded-lg'>
            <Text>Sign out</Text>
        </TouchableOpacity>
        </ThemedView>
    )
}
export default Account
