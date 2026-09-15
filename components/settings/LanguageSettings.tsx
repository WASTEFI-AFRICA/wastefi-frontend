"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

/**
 * Language Settings
 * Configure app language preferences
 */

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const availableLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
];

interface LanguageSettingsProps {
  currentLanguage?: string;
  onChange?: (languageCode: string) => void;
}

export function LanguageSettings({
  currentLanguage = "en",
  onChange,
}: LanguageSettingsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    onChange?.(code);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5" />
          App Language
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Choose your preferred language for the app interface
        </p>

        <div className="space-y-2">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                selectedLanguage === language.code
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center text-lg">
                  {language.code.toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-medium">{language.name}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {language.nativeName}
                  </p>
                </div>
              </div>
              {selectedLanguage === language.code && (
                <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--muted-foreground)] mt-4 p-3 bg-[var(--muted)] rounded-lg">
          <strong>Note:</strong> Language changes will take effect immediately. Some content may still appear in English until full translation is complete.
        </p>
      </CardContent>
    </Card>
  );
}
