# humaneforms

**Form fields that never reject a valid human.**

Names aren't all ASCII. Emails have `+tags` and IDN domains. Not every country has a
"state" or a postal code. A date of birth can't be in the future — and `01/02/2020`
is ambiguous. humaneforms handles the edge cases real people actually hit, so your
forms stop turning away real customers.

[![@humaneforms/core](https://img.shields.io/npm/v/@humaneforms/core?label=%40humaneforms%2Fcore)](https://www.npmjs.com/package/@humaneforms/core)
[![@humaneforms/react](https://img.shields.io/npm/v/@humaneforms/react?label=%40humaneforms%2Freact)](https://www.npmjs.com/package/@humaneforms/react)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**→ Live demos & the "falsehoods" write-ups: [humaneforms.dev](https://humaneforms.dev)**

## What it handles

| Field | What it gets right |
|-------|--------------------|
| **Name** | Mononyms, accents, apostrophes, any script — never "letters only" |
| **Email** | Plus-tags, multiple dots, IDN domains; warns rather than falsely rejecting |
| **Phone** | Every country (via `libphonenumber-js`); normalizes to E.164 |
| **Postal address** | Country-aware — no forced state or ZIP (Hong Kong and Ireland have neither) |
| **Date / DOB** | Unambiguous ISO `YYYY-MM-DD`, timezone-safe, no future birthdays |

Each field ships a `validate*` and a `normalize*` function plus an edge-case
**corpus** — the real-world inputs that break naive forms — which doubles as ready-made
test fixtures.

The guiding rule everywhere: **warn, don't reject.** A real centenarian, a single-letter
surname, or a brand-new TLD should never be turned away.

## Packages

| Package | What it is |
|---------|------------|
| [`@humaneforms/core`](https://www.npmjs.com/package/@humaneforms/core) | Framework-agnostic validation + normalization + the corpus. One dependency (`libphonenumber-js`). |
| [`@humaneforms/react`](https://www.npmjs.com/package/@humaneforms/react) | Headless `useHumaneField` hook + unstyled field components, built on core. React 18 & 19. |

## Install

```bash
npm install @humaneforms/core      # logic only — works with any framework
npm install @humaneforms/react     # + React components and the headless hook
```

## Quick start

### Core — any framework, no UI

```ts
import { validateEmail, normalizeEmail, validatePhone } from "@humaneforms/core";

validateEmail("user+tag@Example.com").valid;   // true
normalizeEmail("user+tag@Example.com");         // "user+tag@example.com"

validatePhone("+44 7700 900123").valid;         // true (normalizes to E.164)
```

### React — drop-in fields (headless, unstyled)

```tsx
import { NameField, EmailField, DobField } from "@humaneforms/react";

<NameField validateOn="change" onResult={(r) => console.log(r.valid, r.messages)} />
```

### React — the headless hook, bring your own markup

```tsx
import { useHumaneField } from "@humaneforms/react";
import { validatePhone } from "@humaneforms/core";

const phone = useHumaneField({
  initialValue: "",
  validate: (v) => validatePhone(v, { defaultCountry: "US" }),
});
// phone.value, phone.setValue, phone.result, phone.showMessages …
```

The React fields are intentionally **unstyled** — you own the CSS.

## Free vs the Pack (open-core)

This repository (MIT) is the free, open-source core: the validation logic and the
headless React fields. They never expire and never nag.

The optional **[humaneforms Pack](https://humaneforms.dev/pricing)** adds, for teams who
want it done-for-you:

- drop-in **styled** components,
- a **country-aware `AddressField`** (per-country labels, ordering, and which fields even exist),
- a **hybrid date-of-birth field** with a calendar picker.

(Note: address *validation* itself lives in `@humaneforms/core` and is free — the Pack
ships the polished, country-aware UI on top of it.)

## Develop

This is a pnpm workspace.

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT © humaneforms
