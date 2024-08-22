import { View, StatusBar, FlatList } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useIsFocused  } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Counter } from "../components/Counter";
import { getCounters } from "./db/database";
import { useCounter } from "./context";
import { Audio } from 'expo-av';

export default function Index() {
  const isFocused = useIsFocused();
  
  const [counters, setCounters] = useState([]);
  const { setCounterId } = useCounter();
  const [sound, setSound] = useState();

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/tap.mp3')
      );
      sound.setVolumeAsync(0.3);
      setSound(sound);
    }

    loadSound();

    return () => {
      sound?.unloadAsync(); // Ensure to unload sound when component unmounts
    };
  }, []);

  const playSound = async () => {
    if (sound) {
      await sound.replayAsync(); // Replay sound if already loaded
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        const countersData = getCounters().map((counter) => ({
          id: counter.id,
          title: counter.title,
          value: counter.value,
          color: counter.color,
          backgroundColor: counter.bgColor,
        }));
        setCounters(countersData);
        setCounterId(0);
      }
    }, [isFocused]),
  );

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-blue-300 dark:bg-stone-600">
        <StatusBar animated={true} backgroundColor="transparent" />
        <FlatList
          data={counters}
          keyExtractor={(counter) => counter.id}
          renderItem={({ item }) => <Counter counter={item} playSound={playSound} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          className="w-full px-3 mt-3 mb-2"
        />
      </View>
    </SafeAreaProvider>
  );
}
