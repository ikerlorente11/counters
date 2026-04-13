import { View, Text, Pressable } from "react-native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { Add, Edit, Light, Dark } from './Icons';
import { useCounter } from "../lib/counterContext";
import { updateConfig } from "../lib/db/database";
import { useColorScheme } from "nativewind";

/**
 * Global top bar with theme toggle and contextual action button.
 * @param {{title: string}} props
 * @returns {JSX.Element}
 */
export function Topbar({ title }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId } = useCounter();
  const isHomePath = path === "/";
  const isCounterDetailPath = regex.test(path);

  let actionIcon = null;
  let actionLabel = "Open action";

  if (isHomePath) {
    actionIcon = <Add className="text-stone-900 dark:text-stone-100" size={24} />;
    actionLabel = "Create counter";
  } else if (isCounterDetailPath) {
    actionIcon = <Edit className="text-stone-900 dark:text-stone-100" size={24} />;
    actionLabel = "Edit counter";
  }

  useEffect(() => {
    updateConfig({ field: "theme", value: colorScheme });
  }, [colorScheme]);

  const handleToggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <View
      className="relative flex-row items-center justify-between px-4 pb-4 border-b bg-stone-100 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
      style={{ paddingTop: insets.top + 10, minHeight: insets.top + 72 }}
    >
      <Pressable
        onPress={handleToggleTheme}
        className="z-10 items-center justify-center w-11 h-11 rounded-2xl bg-stone-200 dark:bg-stone-800"
        accessibilityRole="button"
        accessibilityLabel="Toggle application theme"
      >
        {colorScheme === "dark" ? (
          <Light size={22} className="text-stone-900 dark:text-stone-100" />
        ) : (
          <Dark size={22} className="text-stone-900 dark:text-stone-100" />
        )}
      </Pressable>
      <Text
        pointerEvents="none"
        className="absolute inset-x-0 z-0 self-center mx-auto text-3xl font-black tracking-tight text-center text-stone-900 dark:text-stone-100"
      >
        {title}
      </Text>
      {actionIcon ? (
        <Link href={`/counter/edit/${counterId || 0}`} className="z-10" asChild>
          <Pressable
            className="items-center justify-center w-11 h-11 rounded-2xl bg-stone-200 dark:bg-stone-800"
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            {actionIcon}
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}
