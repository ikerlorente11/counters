import { View, StatusBar, ScrollView, Text } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DraggableCounter } from "../components/DraggableCounter";
import { getCounters, updateCountersOrder } from "../lib/db/database";
import {
  getDragCompensation,
  getDropIndex,
  getGridItemWidth,
  moveItem,
} from "../lib/counterReordering";
import { useCounter } from "../lib/counterContext";
import { useI18n } from "../lib/i18n";
import { GRID_LAYOUT_MODE } from "../lib/layoutMode";
import { createAudioPlayer, setIsAudioActiveAsync } from "expo-audio";

/**
 * Main screen listing all counters and handling tap audio lifecycle.
 * @returns {JSX.Element}
 */
export default function Index() {
  const { t } = useI18n();
  const [counters, setCounters] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragCompensation, setDragCompensation] = useState({ x: 0, y: 0 });
  const [listWidth, setListWidth] = useState(0);
  const { setCounterId, layoutMode } = useCounter();
  const soundRef = useRef(null);
  const countersRef = useRef([]);
  const dragStartCountersRef = useRef([]);
  const dragStartOrderRef = useRef([]);
  const dragStartIndexRef = useRef(null);
  const lastTargetIndexRef = useRef(null);
  const isGridLayout = layoutMode === GRID_LAYOUT_MODE;

  useEffect(() => {
    countersRef.current = counters;
  }, [counters]);

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
      countersRef.current = countersData;
      setCounterId(0);
      setDraggingId(null);
      setDragCompensation({ x: 0, y: 0 });
    }, [setCounterId]),
  );

  const handleDragStateChange = (counterId, isActive) => {
    if (isActive) {
      dragStartCountersRef.current = [...countersRef.current];
      dragStartOrderRef.current = countersRef.current.map((counter) => counter.id);
      dragStartIndexRef.current = countersRef.current.findIndex((counter) => counter.id === counterId);
      lastTargetIndexRef.current = dragStartIndexRef.current;
    } else {
      dragStartIndexRef.current = null;
      lastTargetIndexRef.current = null;
      setDragCompensation({ x: 0, y: 0 });
    }
    setDraggingId(isActive ? counterId : null);
  };

  const handleDragMove = (counterId, dragData) => {
    const baseCounters = dragStartCountersRef.current;
    const startIndex = dragStartIndexRef.current;
    if (!baseCounters.length || startIndex === null || startIndex < 0) {
      return;
    }

    const toIndex = getDropIndex({
      fromIndex: startIndex,
      itemCount: baseCounters.length,
      layoutMode,
      translationX: dragData.translationX,
      translationY: dragData.translationY,
      containerWidth: listWidth,
    });

    if (toIndex === lastTargetIndexRef.current) {
      return;
    }

    lastTargetIndexRef.current = toIndex;
    const nextCounters = moveItem(baseCounters, startIndex, toIndex);
    setDragCompensation(
      getDragCompensation({
        fromIndex: startIndex,
        toIndex,
        layoutMode,
        containerWidth: listWidth,
      }),
    );
    countersRef.current = nextCounters;
    setCounters(nextCounters);
  };

  const handleDrop = () => {
    setDraggingId(null);
    setDragCompensation({ x: 0, y: 0 });

    const nextCounters = countersRef.current;
    const previousOrder = dragStartOrderRef.current;
    const nextOrder = nextCounters.map((counter) => counter.id);

    if (JSON.stringify(previousOrder) === JSON.stringify(nextOrder)) {
      return;
    }

    const success = updateCountersOrder(nextCounters.map((counter) => counter.id));
    if (!success) {
      const restoredCounters = getCounters().map((counter) => ({
        id: counter.id,
        title: counter.title,
        value: counter.value,
        color: counter.color,
        backgroundColor: counter.bgColor,
      }));
      countersRef.current = restoredCounters;
      setCounters(restoredCounters);
    }
  };

  const gridItemWidth = getGridItemWidth(listWidth);

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-stone-100 dark:bg-stone-950">
        <StatusBar animated={true} backgroundColor="transparent" barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
            flexGrow: counters.length === 0 ? 1 : undefined,
          }}
          showsVerticalScrollIndicator={false}
        >
          {counters.length === 0 ? (
            <View className="items-center justify-center px-6 py-12 mt-10 border border-dashed rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
              <Text className="text-xl font-bold text-center text-stone-800 dark:text-stone-100">
                {t("home.emptyTitle")}
              </Text>
              <Text className="mt-2 text-base text-center text-stone-600 dark:text-stone-300">
                {t("home.emptyDescription")}
              </Text>
            </View>
          ) : (
            <View
              onLayout={(event) => {
                setListWidth(event.nativeEvent.layout.width);
              }}
              style={{
                flexDirection: isGridLayout ? "row" : "column",
                flexWrap: isGridLayout ? "wrap" : "nowrap",
                justifyContent: "space-between",
              }}
            >
              {counters.map((counter) => (
                <View
                  key={counter.id}
                  style={isGridLayout ? {
                    width: gridItemWidth > 0 ? gridItemWidth : "48%",
                    marginBottom: 12,
                  } : {
                    width: "100%",
                    marginBottom: 12,
                  }}
                >
                  <DraggableCounter
                    counter={counter}
                    playSound={playSound}
                    isDragging={draggingId === counter.id}
                    shouldAnimateLayout={draggingId !== null && draggingId !== counter.id}
                    dragCompensation={draggingId === counter.id ? dragCompensation : { x: 0, y: 0 }}
                    onDragStateChange={handleDragStateChange}
                    onDragMove={handleDragMove}
                    onDrop={handleDrop}
                    layoutMode={layoutMode}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}
