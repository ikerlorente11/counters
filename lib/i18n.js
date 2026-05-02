import { createContext, createElement, useContext, useMemo, useState } from "react";

const TRANSLATIONS = {
  en: {
    app: {
      title: "Counters",
    },
    topbar: {
      toggleTheme: "Toggle application theme",
      openAction: "Open action",
      createCounter: "Create counter",
      editCounter: "Edit counter",
      openMenu: "Open quick actions menu",
      report: "Report",
      layout: "Layout",
      grid: "Grid",
      list: "List",
      layoutChangedTitle: "View updated",
      layoutGridEnabled: "Two-column grid enabled.",
      layoutListEnabled: "List view enabled.",
      recoverArchived: "Recover",
      home: "Home",
      resetAll: "Reset all",
      undoReset: "Undo reset",
      reportTitle: "Quick report",
      reportBody: "Counters: {{counters}}\nRecords: {{records}}\nTotal value: {{total}}",
      language: "Language",
      theme: "Theme",
      languageMenuTitle: "Select language",
      languageMenuBody: "Choose your preferred app language.",
      selectLanguage: "Select {{language}}",
    },
    languages: {
      en: "English",
      es: "Spanish",
    },
    report: {
      title: "Annual report",
      subtitle: "Maximum counter value at the end of each year.",
      yearHeader: "{{year}}",
      itemLine: "{{counter}}: {{value}}",
      itemValue: "{{value}}",
      itemCount: "{{count}} counters",
      empty: "No yearly data available.",
      loading: "Loading report...",
      copyAll: "Copy all",
      copyYear: "Copy {{year}}",
      expandYear: "Expand year {{year}}",
      collapseYear: "Collapse year {{year}}",
      savePdf: "Save PDF",
      copySuccessTitle: "Copied",
      copySuccessBody: "The report has been copied to the clipboard.",
      copyYearSuccessBody: "Year {{year}} has been copied.",
      pdfReadyTitle: "PDF ready",
      year: "Year",
      counter: "Counter",
      value: "Value",
      date: "Date",
    },
    home: {
      emptyTitle: "No counters yet",
      emptyDescription: "Tap + on the top right to create your first one.",
      reorderTitle: "Reorder counters",
      reorderSubtitle: "Press and hold a counter, or use the arrows to change the order.",
      save: "Save",
      orderUpdated: "Order updated",
      orderSaved: "Counters have been reordered.",
      orderSaveError: "Failed to save the new order.",
    },
    counter: {
      increment: "Increment {{title}}",
      decrement: "Decrement {{title}}",
    },
    chart: {
      empty: "No values available yet.",
      loading: "Loading...",
      trend: "Trend",
      currentValue: "Current value",
      range: "Range",
      records: "{{count}} records",
    },
    detail: {
      showChartRange: "Show {{range}} chart range",
      registry: "Registry",
      emptyRegistry: "No values recorded yet.",
    },
    filters: {
      "7d": "7d",
      "30d": "30d",
      "90d": "90d",
      "6m": "6m",
      all: "All",
    },
    form: {
      defaultCounterTitle: "Counter",
      createCounter: "Create counter",
      editCounter: "Edit counter",
      subtitle: "Keep it simple: name, initial value, and colors.",
      name: "Name",
      value: "Value",
      color: "Color",
      background: "Background",
      save: "Save",
      delete: "Delete",
      reset: "Reset",
      saveCounter: "Save counter",
      deleteCounter: "Delete counter",
      resetCounter: "Reset counter",
      selectColor: "Select color",
      selectNamedColor: "Select {{name}} color",
      apply: "Apply",
      close: "Close",
      cancel: "Cancel",
      recoverArchived: "Recover archived",
      recoverArchivedCounter: "Recover archived counter",
      archivedListTitle: "Archived counters",
      archivedListSubtitle: "Select one to restore it.",
      noArchivedCounters: "No archived counters.",
    },
    alert: {
      validationError: "Validation error",
      saveError: "Save error",
      updateError: "Update error",
      deleteError: "Delete error",
      deleteConfirmTitle: "Archive counter",
      deleteConfirmBody: "This counter will be archived and hidden from the list. You can restore it in future versions.",
      archiveAction: "Archive",
      restoreError: "Restore error",
      restoreFailed: "Counter could not be restored.",
      createFailed: "Counter could not be created.",
      updateNotFound: "Counter was not found.",
      updateFailed: "Counter could not be updated.",
      deleteFailed: "Counter could not be archived.",
      resetConfirmTitle: "Reset counter",
      resetConfirmBody: "The counter value will be set to 0. The history will be preserved.",
      resetAllConfirmTitle: "Reset all counters",
      resetAllConfirmBody: "All counter values will be set to 0. The history will be preserved.",
      resetAction: "Reset",
      resetError: "Reset error",
      resetFailed: "Counter could not be reset.",
      resetAllFailed: "Counters could not be reset.",
    },
    validation: {
      invalidInteger: "Value must be a valid integer.",
    },
    notifications: {
      menuLabel: "Notifications",
      modalTitle: "Notifications",
      modalBody: "Get a daily reminder to update your counters.",
      enable: "Enable notifications",
      time: "Reminder time",
      save: "Save",
      title: "Counter Reminder",
      body: "Don't forget to update your counters today!",
      permissionDenied: "Permission denied",
      permissionDeniedBody: "Enable notifications in your device settings.",
    },
    feedback: {
      menuLabel: "Feedback",
      modalTitle: "Tap feedback",
      modalBody: "Adjust sound and vibration when pressing + and -.",
      soundVolume: "Volume",
      soundVolumeAccessibility: "Adjust tap sound volume",
      vibrationStrength: "Vibration",
      vibrationStrengthAccessibility: "Adjust tap vibration strength",
      save: "Save",
    },
  },
  es: {
    app: {
      title: "Contadores",
    },
    topbar: {
      toggleTheme: "Cambiar el tema de la aplicación",
      openAction: "Abrir acción",
      createCounter: "Crear contador",
      editCounter: "Editar contador",
      openMenu: "Abrir menú de acciones rápidas",
      report: "Informe",
      layout: "Vista",
      grid: "Cuadrícula",
      list: "Lista",
      layoutChangedTitle: "Vista actualizada",
      layoutGridEnabled: "Cuadrícula de dos columnas activada.",
      layoutListEnabled: "Vista en lista activada.",
      recoverArchived: "Recuperar",
      home: "Inicio",
      resetAll: "Resetear todo",
      undoReset: "Deshacer reset",
      reportTitle: "Informe rápido",
      reportBody: "Contadores: {{counters}}\nRegistros: {{records}}\nValor total: {{total}}",
      language: "Idioma",
      theme: "Tema",
      languageMenuTitle: "Seleccionar idioma",
      languageMenuBody: "Elige el idioma de la aplicación.",
      selectLanguage: "Seleccionar {{language}}",
    },
    languages: {
      en: "Inglés",
      es: "Español",
    },
    report: {
      title: "Informe anual",
      subtitle: "Valor máximo de los contadores al finalizar cada año.",
      yearHeader: "{{year}}",
      itemLine: "{{counter}}: {{value}}",
      itemValue: "{{value}}",
      itemCount: "{{count}} contadores",
      empty: "No hay datos anuales disponibles.",
      loading: "Cargando informe...",
      copyAll: "Copiar todo",
      copyYear: "Copiar {{year}}",
      expandYear: "Expandir año {{year}}",
      collapseYear: "Minimizar año {{year}}",
      savePdf: "Guardar PDF",
      copySuccessTitle: "Copiado",
      copySuccessBody: "El informe se ha copiado al portapapeles.",
      copyYearSuccessBody: "Se ha copiado el año {{year}}.",
      pdfReadyTitle: "PDF listo",
      year: "Año",
      counter: "Contador",
      value: "Valor",
      date: "Fecha",
    },
    home: {
      emptyTitle: "Todavía no hay contadores",
      emptyDescription: "Pulsa + arriba a la derecha para crear el primero.",
      reorderTitle: "Reordenar contadores",
      reorderSubtitle: "Mantén pulsado un contador, o usa las flechas para cambiar el orden.",
      save: "Guardar",
      orderUpdated: "Orden actualizado",
      orderSaved: "Los contadores han sido reordenados.",
      orderSaveError: "Error al guardar el nuevo orden.",
    },
    counter: {
      increment: "Incrementar {{title}}",
      decrement: "Reducir {{title}}",
    },
    chart: {
      empty: "Todavía no hay valores.",
      loading: "Cargando...",
      trend: "Tendencia",
      currentValue: "Valor actual",
      range: "Rango",
      records: "{{count}} registros",
    },
    detail: {
      showChartRange: "Mostrar rango {{range}} en la gráfica",
      registry: "Registro",
      emptyRegistry: "Todavía no hay valores guardados.",
    },
    filters: {
      "7d": "7d",
      "30d": "30d",
      "90d": "90d",
      "6m": "6m",
      all: "Todo",
    },
    form: {
      defaultCounterTitle: "Contador",
      createCounter: "Crear contador",
      editCounter: "Editar contador",
      subtitle: "Hazlo simple: nombre, valor inicial y colores.",
      name: "Nombre",
      value: "Valor",
      color: "Color",
      background: "Fondo",
      save: "Guardar",
      delete: "Eliminar",
      reset: "Resetear",
      saveCounter: "Guardar contador",
      deleteCounter: "Eliminar contador",
      resetCounter: "Resetear contador",
      selectColor: "Seleccionar color",
      selectNamedColor: "Seleccionar color de {{name}}",
      apply: "Aplicar",
      close: "Cerrar",
      cancel: "Cancelar",
      recoverArchived: "Recuperar archivado",
      recoverArchivedCounter: "Recuperar contador archivado",
      archivedListTitle: "Contadores archivados",
      archivedListSubtitle: "Selecciona uno para restaurarlo.",
      noArchivedCounters: "No hay contadores archivados.",
    },
    alert: {
      validationError: "Error de validación",
      saveError: "Error al guardar",
      updateError: "Error al actualizar",
      deleteError: "Error al eliminar",
      deleteConfirmTitle: "Archivar contador",
      deleteConfirmBody: "Este contador se archivará y dejará de aparecer en la lista. Podrás recuperarlo en versiones futuras.",
      archiveAction: "Archivar",
      restoreError: "Error al restaurar",
      restoreFailed: "No se ha podido restaurar el contador.",
      createFailed: "No se ha podido crear el contador.",
      updateNotFound: "No se ha encontrado el contador.",
      updateFailed: "No se ha podido actualizar el contador.",
      deleteFailed: "No se ha podido archivar el contador.",
      resetConfirmTitle: "Resetear contador",
      resetConfirmBody: "El valor del contador se pondrá a 0. El historial se conservará.",
      resetAllConfirmTitle: "Resetear todos los contadores",
      resetAllConfirmBody: "Todos los valores se pondrán a 0. El historial se conservará.",
      resetAction: "Resetear",
      resetError: "Error al resetear",
      resetFailed: "No se ha podido resetear el contador.",
      resetAllFailed: "No se han podido resetear los contadores.",
    },
    validation: {
      invalidInteger: "El valor debe ser un número entero válido.",
    },
    notifications: {
      menuLabel: "Notificaciones",
      modalTitle: "Notificaciones",
      modalBody: "Recibe un recordatorio diario para actualizar tus contadores.",
      enable: "Activar notificaciones",
      time: "Hora del recordatorio",
      save: "Guardar",
      title: "Recordatorio de contadores",
      body: "¡No olvides actualizar tus contadores hoy!",
      permissionDenied: "Permiso denegado",
      permissionDeniedBody: "Activa las notificaciones en los ajustes del dispositivo.",
    },
    feedback: {
      menuLabel: "Feedback",
      modalTitle: "Feedback al pulsar",
      modalBody: "Ajusta sonido y vibracion al pulsar + y -.",
      soundVolume: "Volumen",
      soundVolumeAccessibility: "Ajustar volumen del sonido al pulsar",
      vibrationStrength: "Vibracion",
      vibrationStrengthAccessibility: "Ajustar fuerza de vibracion al pulsar",
      save: "Guardar",
    },
  },
};

const LOCALE_BY_LANGUAGE = {
  en: "en-US",
  es: "es-ES",
};

export const SUPPORTED_LANGUAGES = ["en", "es"];

const I18nContext = createContext({
  language: "en",
  t: (key) => key,
  formatDate: (dateValue) => dateValue,
  setLanguage: () => {},
});

/**
 * Validates and normalizes one language code.
 * @param {string | null | undefined} language
 * @returns {"en" | "es"}
 */
export function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "en";
}

/**
 * Resolves app language from a locale string.
 * @param {string | null | undefined} locale
 * @returns {"en" | "es"}
 */
export function resolveLanguage(locale) {
  return locale?.toLowerCase().startsWith("es") ? "es" : "en";
}

/**
 * Gets the current device locale.
 * @returns {string}
 */
export function getDeviceLocale() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  } catch {
    return "en-US";
  }
}

/**
 * Parses a persisted ISO date into a UTC Date instance.
 * @param {string} dateValue
 * @returns {Date | null}
 */
export function parsePersistedDate(dateValue) {
  if (typeof dateValue !== "string") {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map((value) => Number.parseInt(value, 10));

  if (!year || !month || !day) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Returns a translated string formatter for one language.
 * @param {"en" | "es"} language
 * @returns {(key: string, params?: Record<string, string | number>) => string}
 */
export function createTranslator(language) {
  return (key, params = {}) => {
    const template = key.split(".").reduce((currentValue, part) => currentValue?.[part], TRANSLATIONS[language])
      ?? key;

    return Object.entries(params).reduce(
      (translatedValue, [paramKey, paramValue]) => translatedValue.replaceAll(`{{${paramKey}}}`, String(paramValue)),
      template,
    );
  };
}

/**
 * Formats a persisted date string using the selected language.
 * @param {string} dateValue
 * @param {"en" | "es"} language
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatPersistedDate(dateValue, language, options) {
  const parsedDate = parsePersistedDate(dateValue);

  if (!parsedDate) {
    return dateValue;
  }

  return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
    timeZone: "UTC",
    ...options,
  }).format(parsedDate);
}

/**
 * Provides app translations based on device locale.
 * @param {{children: JSX.Element | JSX.Element[], initialLanguage?: string}} props
 * @returns {JSX.Element}
 */
export function I18nProvider({ children, initialLanguage }) {
  const [language, setLanguage] = useState(
    normalizeLanguage(initialLanguage ?? resolveLanguage(getDeviceLocale())),
  );
  const value = useMemo(() => {
    const t = createTranslator(language);

    return {
      language,
      t,
      formatDate: (dateValue, options) => formatPersistedDate(dateValue, language, options),
      setLanguage: (nextLanguage) => {
        setLanguage(normalizeLanguage(nextLanguage));
      },
    };
  }, [language]);

  return createElement(I18nContext.Provider, { value }, children);
}

/**
 * Returns translation helpers for the current app language.
 * @returns {{language: "en" | "es", t: (key: string, params?: Record<string, string | number>) => string, formatDate: (dateValue: string, options?: Intl.DateTimeFormatOptions) => string, setLanguage: (language: "en" | "es") => void}}
 */
export function useI18n() {
  return useContext(I18nContext);
}