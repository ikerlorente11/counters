import Constants from "expo-constants";
import { createTranslator } from "./i18n";

const isExpoGo =
  Constants.executionEnvironment === "storeClient" ||
  Constants.appOwnership === "expo";

let Notifications = null;

if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    Notifications = null;
  }
}

/**
 * Requests permission to send notifications.
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (!Notifications) return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

/**
 * Schedules a daily counter reminder at the given hour/minute.
 * @param {{hour: number, minute: number, language: string}} params
 */
export async function scheduleCounterReminder({ hour, minute, language }) {
  if (!Notifications) return;
  try {
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
  } catch {
    // not available
  }
}

/**
 * Cancels all scheduled counter reminders.
 */
export async function cancelCounterReminder() {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // not available
  }
}
