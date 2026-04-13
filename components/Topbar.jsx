import { View, Text, Pressable } from "react-native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { Add, Edit, Light, Dark } from './Icons';
import { useCounter } from "../app/context";
import { updateConfig } from "../app/db/database";
import { useColorScheme } from "nativewind";

/**
 * Global top bar with theme toggle and contextual action button.
 * @param {{title: string}} props
 * @returns {JSX.Element}
 */
export function Topbar({ title }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId } = useCounter();
  const isHomePath = path === "/";
  const isCounterDetailPath = regex.test(path);

  let actionIcon = null;
  let actionLabel = "Open action";

  if (isHomePath) {
    actionIcon = <Add className="text-blue-100 dark:text-stone-100" />;
    actionLabel = "Create counter";
  } else if (isCounterDetailPath) {
    actionIcon = <Edit className="text-blue-100 dark:text-stone-100" />;
    actionLabel = "Edit counter";
  }

  useEffect(() => {
    updateConfig({ field: "theme", value: colorScheme });
  }, [colorScheme]);

  return (
    <View
      className="relative flex-row items-end justify-between px-3 py-2 bg-blue-600 dark:bg-stone-900"
      style={{ paddingTop: insets.top + 10 }}
    >
      <Pressable
        onPress={toggleColorScheme}
        className="z-10"
        accessibilityRole="button"
        accessibilityLabel="Toggle application theme"
      >
        {colorScheme === "dark" ? <Light size={40} className="text-blue-100 dark:text-stone-100" /> : <Dark size={40} className="text-blue-100 dark:text-stone-100" />}
      </Pressable>
      <Text className="absolute inset-x-0 z-0 mx-auto text-4xl font-bold text-center text-blue-100 dark:text-stone-100">{title}</Text>
      {actionIcon ? (
        <Link href={`/counter/edit/${counterId || 0}`} className="z-10" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel={actionLabel}>
            {actionIcon}
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}
