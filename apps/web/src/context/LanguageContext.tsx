import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
import { dictionaries } from '@/i18n/dictionary';
import type { Language } from '@/i18n/dictionary';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** El diccionario completo del idioma activo — así `useTranslation()` no repite el lookup. */
  t: (typeof dictionaries)[Language];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Idioma de la interfaz (ES/EN). Español por defecto — es el idioma de
 * PROMPT_MAESTRO.md y de los datos simulados (`src/mocks`), que no se
 * traducen: son contenido, no texto de interfaz. Ver `i18n/dictionary.ts`
 * para el alcance real de lo que sí cambia de idioma.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    readStorage<Language>(STORAGE_KEYS.language, 'es'),
  );

  // `lang` en <html> importa para lectores de pantalla y para que los
  // buscadores no indexen la versión en inglés como si fuera español.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    writeStorage(STORAGE_KEYS.language, next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const next: Language = current === 'es' ? 'en' : 'es';
      writeStorage(STORAGE_KEYS.language, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t: dictionaries[language] }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>.');
  return context;
}

/** Atajo para cuando solo hace falta el diccionario, no cambiar de idioma. */
export function useTranslation() {
  return useLanguage().t;
}
