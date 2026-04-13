import { View, StatusBar, FlatList } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Counter } from "../components/Counter";
import { getCounters } from "./db/database";
import { useCounter } from "./context";
import { Audio } from "expo-av";

/**
 * Main screen listing all counters and handling tap audio lifecycle.
 * @returns {JSX.Element}
 */
export default function Index() {
  const [counters, setCounters] = useState([]);
  const { setCounterId } = useCounter();
  const soundRef = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require("../assets/tap.mp3"));
        await sound.setVolumeAsync(0.3);
        soundRef.current = sound;
      } catch (error) {
        console.error("Failed to load tap sound:", error);
      }
    };

    void loadSound();

    return () => {
      if (soundRef.current) {
        void soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const playSound = async () => {
    if (!soundRef.current) {
      return;
    }

    try {
      await soundRef.current.replayAsync();
    } catch (error) {
      console.error("Failed to replay tap sound:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const countersData = getCounters().map((counter) => ({
        id: counter.id,
        title: counter.title,
        value: counter.value,
        color: counter.color,
        backgroundColor: counter.bgColor,
      }));
      setCounters(countersData);
      setCounterId(0);
    }, [setCounterId]),
  );

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-blue-300 dark:bg-stone-600">
        <StatusBar animated={true} backgroundColor="transparent" />
        <FlatList
          data={counters}
          keyExtractor={(counter) => counter.id.toString()}
          renderItem={({ item }) => <Counter counter={item} playSound={playSound} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          className="w-full px-3 mt-3 mb-2"
        />
      </View>
    </SafeAreaProvider>
  );
}
