import {
    SafeAreaView,
    Text,
} from 'react-native';

export default function ChangeMood({ route }) {

    const { day, monthAndYear } = route.params;
    console.log("MonthAndYear: ", monthAndYear)
    return (
        <SafeAreaView
            style={{
                display: "flex",
                width: '100%',
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Welcome To Mood Change Page. The mood you want to change is: </Text>
            <Text>{day}</Text>
        </SafeAreaView>
    )
}
