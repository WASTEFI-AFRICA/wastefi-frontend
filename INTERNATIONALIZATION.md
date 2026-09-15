# Internationalization (i18n)

WasteFi supports multiple languages to serve users across different regions.

## Supported Languages

- **English** (en) - Default
- **Kiswahili** (sw) - Swahili for East African users
- **Français** (fr) - French for West and Central African users

## Setup

The app uses `next-intl` for internationalization support.

### Installation

```bash
npm install next-intl
```

### Configuration

Translation files are located in `i18n/messages/`:

```
i18n/
├── messages/
│   ├── en.json    # English translations
│   ├── sw.json    # Swahili translations
│   └── fr.json    # French translations
└── request.ts     # i18n configuration
```

## Usage

### Language Switcher Component

The `LanguageSwitcher` component allows users to change languages:

```tsx
import { LanguageSwitcher } from '@/components/i18n'

export function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  )
}
```

### Translation Keys

Translation keys are organized by feature:

- **common**: Common UI elements (buttons, labels)
- **auth**: Authentication related text
- **dashboard**: Dashboard specific text
- **wallet**: Wallet and transactions
- **submission**: Waste submission
- **profile**: User profile and settings

### Adding New Translations

1. Add the key to all language files:

**en.json**
```json
{
  "newFeature": {
    "title": "New Feature"
  }
}
```

**sw.json**
```json
{
  "newFeature": {
    "title": "Kipengele Kipya"
  }
}
```

**fr.json**
```json
{
  "newFeature": {
    "title": "Nouvelle fonctionnalité"
  }
}
```

2. Use the translation in your component:

```tsx
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('newFeature')
  
  return <h1>{t('title')}</h1>
}
```

## Adding More Languages

To add support for a new language:

1. Create a new JSON file in `i18n/messages/` (e.g., `ar.json` for Arabic)
2. Copy the structure from `en.json` and translate all strings
3. Add the language to the `LanguageSwitcher` component:

```tsx
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }, // New language
]
```

## Translation Guidelines

### 1. Keep Keys Descriptive

✅ Good: `dashboard.statistics.totalEarnings`
❌ Bad: `dash.stats.te`

### 2. Use Nested Structure

```json
{
  "wallet": {
    "balance": {
      "current": "Current Balance",
      "available": "Available Balance"
    }
  }
}
```

### 3. Handle Pluralization

For countable items, provide both singular and plural forms:

```json
{
  "submissions": {
    "count_one": "{{count}} submission",
    "count_other": "{{count}} submissions"
  }
}
```

### 4. Maintain Consistency

- Use the same terminology across all features
- Keep button text consistent (e.g., always use "Submit" not mix with "Send")
- Follow platform conventions for each language

## RTL Support (Future)

For right-to-left languages (Arabic, Hebrew):

1. Add RTL detection in `layout.tsx`
2. Update CSS with RTL-aware styles
3. Test all UI components in RTL mode

## Testing Translations

1. Switch between languages using the LanguageSwitcher
2. Verify all UI text updates correctly
3. Check for:
   - Missing translations (shows translation keys)
   - Text overflow in longer languages
   - Proper formatting of dates, numbers, currency

## Best Practices

1. **Extract all user-facing text** - Never hardcode strings in components
2. **Use translation namespaces** - Organize translations by feature
3. **Keep translations up-to-date** - Update all language files when adding features
4. **Test with real content** - Use actual translations, not Lorem Ipsum
5. **Consider cultural context** - Colors, icons, and images may have different meanings

## Current Coverage

- ✅ Common UI elements
- ✅ Authentication flows
- ✅ Dashboard
- ✅ Wallet and transactions
- ✅ Waste submission
- ✅ Profile and settings
- ⏳ Admin features (to be added)
- ⏳ Error messages (to be added)
- ⏳ Email notifications (to be added)

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [React Intl Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)
- [Unicode CLDR](http://cldr.unicode.org/) - For locale data

## Support

For translation issues or adding new languages, contact the development team or submit a pull request with the translation files.
