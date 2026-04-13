import { View, StatusBar, FlatList, Text } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Counter } from "../components/Counter";
import { getCounters } from "../lib/db/database";
import { useCounter } from "../lib/counterContext";
import { createAudioPlayer, setIsAudioActiveAsync } from "expo-audio";

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
        await setIsAudioActiveAsync(true);
        const player = createAudioPlayer(require("../assets/tap.mp3"));
        player.volume = 0.3;
        soundRef.current = player;
      } catch (error) {
        console.error("Failed to load tap sound:", error);
      }
    };

    void loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.remove();
        soundRef.current = null;
      }
    };
  }, []);

  const playSound = async () => {
    if (!soundRef.current) {
      return;
    }

    try {
      soundRef.current.seekTo(0);
      soundRef.current.play();
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
      <View className="flex-1 bg-stone-100 dark:bg-stone-950">
        <StatusBar animated={true} backgroundColor="transparent" barStyle="light-content" />
        <FlatList
          data={counters}
          keyExtractor={(counter) => counter.id.toString()}
          renderItem={({ item }) => <Counter counter={item} playSound={playSound} />}
          ListEmptyComponent={(
            <View className="items-center justify-center px-6 py-12 mt-10 border border-dashed rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
              <Text className="text-xl font-bold text-center text-stone-800 dark:text-stone-100">
                No counters yet
              </Text>
              <Text className="mt-2 text-base text-center text-stone-600 dark:text-stone-300">
                Tap + on the top right to create your first one.
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          className="w-full px-4 mt-4 mb-3"
          contentContainerStyle={{ paddingBottom: 24, flexGrow: counters.length === 0 ? 1 : undefined }}
        />
      </View>
    </SafeAreaProvider>
  );
}
