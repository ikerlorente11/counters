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
      recoverArchived: "Recover",
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
      empty: "No yearly data available.",
      copyAll: "Copy all",
      copyYear: "Copy {{year}}",
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
    },
    counter: {
      increment: "Increment {{title}}",
      decrement: "Decrement {{title}}",
    },
    chart: {
      empty: "No values available yet.",
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
      saveCounter: "Save counter",
      deleteCounter: "Delete counter",
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
    },
    validation: {
      invalidInteger: "Value must be a valid integer.",
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
      recoverArchived: "Recuperar",
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
      empty: "No hay datos anuales disponibles.",
      copyAll: "Copiar todo",
      copyYear: "Copiar {{year}}",
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
    },
    counter: {
      increment: "Incrementar {{title}}",
      decrement: "Reducir {{title}}",
    },
    chart: {
      empty: "Todavía no hay valores.",
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
      saveCounter: "Guardar contador",
      deleteCounter: "Eliminar contador",
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
    },
    validation: {
      invalidInteger: "El valor debe ser un número entero válido.",
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