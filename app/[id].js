import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CounterInfo() {
    const {id} = useLocalSearchParams();

    return (
        <View>
            <Text>{id == 0 ? "Nuevo contador" : `Contador ${id}`}</Text>
        </View>
    )
}