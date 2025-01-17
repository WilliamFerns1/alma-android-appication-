import React, {useState, useEffect} from "react";
import {
    Text,
    ActivityIndicator,
    TextInput,
    Image,
    TouchableOpacity,
    View,
}
from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native';


export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();

    const navigation = useNavigation();
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = useState(false)
    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }
        setLoading(true)
        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err) {
            console.log(err);
        }
        setLoading(false)
    };
    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#030637",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                paddingHorizontal: 20,
                gap: 10,
            }}
        >

            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={require('../assets/Logo.png')} // Replace with the actual path to your image
                />
            </View>
            {
                loading ? (
                    <View
                        style={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: "center",
                            width: "100%",
                            gap: 20,
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff"
                            }}
                        >
                            Logging in...
                        </Text>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>

                ) : (
                    <View
                        style={{
                                width: "100%",
                        }}
                    >
                        <View
                            style={{
                                width: "99%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 9
                            }}
                        >
                            <View
                                style={{
                                    width: "99%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 9,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 19,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Email:
                                </Text>
                                <TextInput
                                    style={{
                                        width: "99%",
                                        height: 39,
                                        backgroundColor: 'white', // Set background color to white
                                        borderRadius: 4, // Add border radius for rounded corners
                                        borderWidth: 0, // Add border width for the stroke
                                        borderColor: '#ccc', // Set border color
                                        paddingHorizontal: 9, // Add horizontal padding
                                        fontSize: 15, // Set font size
                                        color: 'black', // Set text color
                                    }}
                                    autoCapitalize="none"
                                    value={emailAddress}
                                    placeholder="example@gmail.com"
                                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                                />

                            </View>
                            <View
                                style={{
                                    width: "99%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 9,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 19,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Password
                                </Text>
                                <TextInput
                                    style={{
                                        width: "99%",
                                        height: 39,
                                        backgroundColor: 'white', // Set background color to white
                                        borderRadius: 4, // Add border radius for rounded corners
                                        borderWidth: 0, // Add border width for the stroke
                                        borderColor: '#ccc', // Set border color
                                        paddingHorizontal: 9, // Add horizontal padding
                                        fontSize: 15, // Set font size
                                        color: 'black', // Set text color
                                    }}
                                    value={password}
                                    placeholder="Password..."
                                    secureTextEntry={true}
                                    onChangeText={(password) => setPassword(password)}
                                />

                                <Text
                                    style={{
                                        color: "white",
                                    }}
                                    >
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: "99%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 10,
                                gap: 25,
                                marginTop: 20,
                            }}
                        >

                            <TouchableOpacity
                                style={{
                                    display: "flex",
                                    paddingHorizontal: 14,
                                    paddingVertical: 21,
                                    flexDirection: "column",
                                    width: "99%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 9,
                                    backgroundColor: "#9948FF",
                                    gap: 15,
                                }}
                                onPress={onSignInPress}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 23,
                                        fontWeight: "bold"
                                    }}
                                >
                                    Log in
                                </Text>
                            </TouchableOpacity>
                            <View
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 10,
                                    width: "100%",
                                    flexDirection: "row",
                                }}
                            >
                                <Text
                                    style={{
                                        width: "45%",
                                        color: "#fff",
                                    }}
                                >
                                    Don't have an account?
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        width: "45%",
                                        display: "flex",
                                        height: 45,
                                        paddingVertical: 5,
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: '#9949FF',
                                        paddingHorizontal: 15,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    onPress={() => navigation.navigate('SignUp')}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 15,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Sign up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    );
}
