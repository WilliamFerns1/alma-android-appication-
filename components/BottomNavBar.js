
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
}
from 'react-native'

import { useSession, useUser } from "@clerk/clerk-expo";

import { useNavigation } from '@react-navigation/native';

export default function BottomNavBar() {
    const { session, signOut } = useSession();

    const navigation = useNavigation();
    return (
        <View
            style={{
                width: '100%',
                display: "flex",
                height: "100%",
                backgroundColor: "#9949FF",
                height: 106,
                paddingVertical: 10,
                paddingHorizontal: 22,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                }}
            >
                <Image
                    source={require('../assets/red-circle.png')} // Replace with the actual path to your image
                    style={{
                        width: 44,
                        height: 44,
                    }}
                />
                <Image
                    source={require('../assets/green-circle.png')} // Replace with the actual path to your image
                    style={{
                        width: 44,
                        height: 44,
                    }}
                />
                <Image
                    style={{
                        width: 44, height: 44,
                    }}
                    source={require('../assets/yellow-circle.png')} // Replace with the actual path to your image
                />
            </View>
            <Image
                source={require('../assets/stats.png')} // Replace with the actual path to your image
                style={{
                }}
            />
            <TouchableOpacity
                style={{
                    display: "flex",
                    width: 86,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 4,
                    borderWidth: 2, // Border width
                    borderColor: 'white', // Border color
                }}
                onPress={async () => {
                    try {
                        // Clear local storage
                        await AsyncStorage.clear();

                        // Reset the navigation stack and navigate to the 'Starter' route
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Starter' }],
                        });
                        signOut();
                        navigation.navigate('SignIn')
                    } catch (error) {
                        console.error('Error clearing local storage:', error);
                    }
                }}
            >
                <Image
                    source={require('../assets/signout.png')} // Replace with the actual path to your image
                    style={{
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}
