import * as Notifications from "expo-notifications";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { createTranslator } from "./i18n";

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Requests permission to send notifications.
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (isExpoGo) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Schedules a daily counter reminder at the given hour/minute.
 * @param {{hour: number, minute: number, language: string}} params
 */
export async function scheduleCounterReminder({ hour, minute, language }) {
  if (isExpoGo) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const t = createTranslator(language);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t("notifications.title"),
      body: t("notifications.body"),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Cancels all scheduled counter reminders.
 */
export async function cancelCounterReminder() {
  if (isExpoGo) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
