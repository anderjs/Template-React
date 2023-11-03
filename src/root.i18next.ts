import axios from "axios";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getLoadPath } from "@learlifyweb/providers.i18n";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const loadPath = getLoadPath(
  process.env.LOCALIZE_CDN,
  process.env.LOCALIZE_PROJECT,
  process.env.LOCALIZE_ENVIRONMENT,
  process.env.LOCALIZE_FALLBACK_LANGUAGE
);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath,
    },
    saveMissing: true,
    missingKeyHandler: (_langs, ns, key, text) => {
      const apiKey = process.env.LOCALIZE_API_KEY;

      const endpoint = process.env.LOCALIZE_TRANSLATIONS;

      return axios.post(
        endpoint,
        {
          content: [
            {
              key,
              text,
              language: process.env.LOCALIZE_FALLBACK_LANGUAGE,
            },
          ],
        },
        {
          headers: {
            "X-SimpleLocalize-Token": apiKey,
          },
        }
      );
    },
    fallbackLng: process.env.LOCALIZE_FALLBACK_LANGUAGE,
  });

export default i18n;
