# Vantage PMO — Front End

> **Precision Architect** · Project Management Office Platform

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Infrastructure Patterns](#api-infrastructure-patterns)
- [Project Structure](#project-structure)
- [Bounded Contexts](#bounded-contexts)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Fake API Server](#fake-api-server)
- [Internationalization](#internationalization)
- [Adding a New Bounded Context](#adding-a-new-bounded-context)
- [Team Conventions](#team-conventions)

---

## Overview

Vantage PMO is a web-based Project Management Office platform that gives executive teams a real-time view of portfolio health, active projects, team performance, scheduling, meetings and reporting.

The front end is built with **Vue 3** following **Domain-Driven Design (DDD)** principles, keeping each business domain isolated and independently maintainable as the team grows.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | Vue 3 (Composition API) |
| State Management | Pinia |
| Routing | Vue Router 4 |
| UI Component Library | PrimeVue 4 + PrimeFlex + PrimeIcons |
| HTTP Client | Axios |
| Internationalization | Vue I18n |
| Build Tool | Vite |
| Fake API | JSON Server 0.17.x |

---

## Architecture

This project follows **Domain-Driven Design (DDD)** with a layered approach per bounded context:

```
bounded-context/
├── application/        # Pinia stores — orchestrates use cases
├── domain/
│   └── model/          # Entities — pure domain objects
├── infrastructure/
│   ├── *-api.js        # Extends BaseEndpoint, maps via assemblers
│   └── *.assembler.js  # Maps raw API response → domain entity
└── presentation/
    ├── components/     # Reusable UI components for this context
    └── views/          # Route-level page components
```

### Shared Kernel

The `shared/` module provides the infrastructure foundation used by **all** bounded contexts:

- `base-api.js` — shared Axios instance configured from `.env`
- `base-endpoint.js` — Generic CRUD class (`getAll`, `getById`, `getByQuery`, `create`, `update`, `delete`)

Important: `base-api.js` exports the reusable Axios client (`baseApi`) used internally by `BaseEndpoint`; it is **not** a class to extend.

Every bounded context API class **extends `BaseEndpoint`** and uses its own assembler to convert raw data into domain entities.

---

## API Infrastructure Patterns

Most bounded contexts follow one of these two patterns:

### 1. Collection resource

Use this when the API returns an array and supports standard CRUD routes such as `/support-tickets` or `/projects`.

```js
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { SupportAssembler } from './support.assembler.js';

class SupportApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_SUPPORT_ENDPOINT_PATH);
    }

    async getAllTickets() {
        const data = await super.getAll();
        return SupportAssembler.toEntities(data);
    }
}
```

### 2. Singleton resource

Use this when the API returns a single object instead of a collection, like the `settings` context backed by `/user-settings` in `server/db.json`.

```js
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { SettingsAssembler } from './settings.assembler.js';

class SettingsApi extends BaseEndpoint {
    constructor() {
        super(import.meta.env.VITE_USER_SETTINGS_ENDPOINT_PATH || '/user-settings');
    }

    async getSettings() {
        const response = await this.api.get(this.resourcePath);
        return SettingsAssembler.toEntity(response.data);
    }

    async updateSettings(settings) {
        const response = await this.api.put(this.resourcePath, settings);
        return SettingsAssembler.toEntity(response.data);
    }
}
```

This keeps the API implementation consistent with the rest of the app: `BaseEndpoint` provides the shared foundation, while each bounded context exposes intent-revealing methods such as `getAllTickets()` or `getSettings()`.

---

## Project Structure

```
src/
├── shared/
│   ├── infrastructure/
│   │   ├── base-api.js           ← Axios instance (reads VITE_API_BASE_URL)
│   │   └── base-endpoint.js      ← Base CRUD class
│   └── presentation/
│       ├── components/
│       │   ├── layout.vue
│       │   ├── language-switcher.vue
│       │   └── footer-content.vue
│       └── views/
│           ├── home.vue
│           └── page-not-found.vue
│
├── iam/                          ← Identity & Access (pending)
├── profile/                      ← User profile & portfolio stats
├── projects/                     ← Active projects tracking
├── task-collaboration/           ← Team board (Kanban + Heatmap)
├── schedule/                     ← Calendar & scheduling
├── meetings/                     ← Meeting management & minutes
├── reports/                      ← Executive reports & analytics
├── support/                      ← Support tickets
├── settings/                     ← User settings
├── system-administration/        ← Platform admin (policies, branding)
│
├── locales/
│   ├── en.json
│   └── es.json
│
├── app.vue
├── main.js
├── router.js
├── pinia.js
├── i18n.js
└── style.css

server/
├── db.json           ← Fake database (seed data for all contexts)
├── routes.json       ← Route mappings (/api/v1/* → /*)
└── start.sh          ← Start JSON Server

.env.development      ← Local API config
.env.production       ← Production API config
```

---

## Bounded Contexts

| Context | Status | Route | Description |
|---|---|---|---|
| `shared` | Active | `/` | Layout, base infrastructure, home dashboard |
| `profile` | Active | `/profile` | User profile and portfolio stats |
| `projects` | Active | `/active-projects` | Active project tracking and milestones |
| `task-collaboration` | Active | `/team` | Team board: Kanban (5 cols) + Activity Heatmap |
| `schedule` | Active | `/schedule` | Calendar view and scheduling |
| `meetings` | Active | `/meetings` | Meeting management, minutes export |
| `reports` | Active | `/reports` | Executive quick reports with live preview |
| `support` | Active | `/support` | Support tickets and bug reports |
| `settings` | Active | `/settings` | User preferences and notifications |
| `system-administration` | Active | `/system-administration` | Platform policies and branding |
| `iam` | Pending | `/iam` | Authentication & authorization |
| `chat-hub` | Pending | `/chat-hub` | Internal messaging |

> New bounded contexts are added incrementally. See [Adding a New Bounded Context](#adding-a-new-bounded-context).

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

Optional for the fake API:

- `json-server` 0.17.x installed globally, **or**
- use the local dev dependency via `npx`

```bash
npm install -g json-server@0.17
```

### Installation

```bash
npm install
```

### Running the App

You need **two terminals** — one for the fake API and one for the app:

```bash
# Terminal 1 — Start the fake API server
cd server
sh start.sh

# Alternative if json-server is not installed globally
npx json-server --watch db.json --routes routes.json --port 3000
```

```bash
# Terminal 2 — Start the Vue app
npm run dev
```

App → `http://localhost:5173`  
API → `http://localhost:3000/api/v1`

---

## Environment Variables

Defined in `.env.development`:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the API | `http://localhost:3000/api/v1` |
| `VITE_USERS_ENDPOINT_PATH` | Users resource | `/users` |
| `VITE_STATS_ENDPOINT_PATH` | Stats resource | `/stats` |
| `VITE_TASKS_ENDPOINT_PATH` | Tasks resource | `/tasks` |
| `VITE_BOARDS_ENDPOINT_PATH` | Team boards | `/boards` |
| `VITE_BOARD_MEMBERS_ENDPOINT_PATH` | Board members | `/board-members` |
| `VITE_TASK_COLLABORATION_ENDPOINT_PATH` | Task collaboration | `/tasks` |
| `VITE_SCHEDULE_ENDPOINT_PATH` | Schedule resource | `/schedule` |
| `VITE_MEETINGS_ENDPOINT_PATH` | Meetings resource | `/meetings` |
| `VITE_REPORTS_ENDPOINT_PATH` | Reports resource | `/reports` |
| `VITE_PROJECTS_ENDPOINT_PATH` | Projects resource | `/projects` |
| `VITE_SUPPORT_ENDPOINT_PATH` | Support tickets | `/support-tickets` |
| `VITE_USER_SETTINGS_ENDPOINT_PATH` | User settings | `/user-settings` |
| `VITE_SYSTEM_ADMINISTRATION_ENDPOINT_PATH` | Admin resource | `/system-administration` |
| `VITE_DEPARTMENTS_ENDPOINT_PATH` | Departments | `/departments` |

---

## Fake API Server

The project uses [JSON Server](https://github.com/typicode/json-server) `v0.17.x` as a fake REST API.

```bash
cd server
sh start.sh
# Runs: json-server --watch db.json --routes routes.json --port 3000
```

`routes.json` maps `/api/v1/*` → `/*`:

```json
{
  "/api/v1/*": "/$1"
}
```

All seed data lives in `server/db.json`. When adding a new bounded context, add its collection there.

---

## Internationalization

The app supports **English (en)** and **Spanish (es)** via Vue I18n.

```
src/locales/
├── en.json
└── es.json
```

Translations are organized by bounded context:

```json
{
  "nav":                 { ... },
  "home":                { ... },
  "profile":             { ... },
  "taskCollaboration":   { ... },
  "meetings":            { ... },
  "reports":             { ... },
  "schedule":            { ... },
  "support":             { ... },
  "settings":            { ... },
  "systemAdministration":{ ... }
}
```

The **language switcher** is in the top bar. Always add keys to **both** locale files.

---

## Adding a New Bounded Context

### 1. Create the folder structure

```
src/my-context/
├── application/
│   └── my-context.store.js
├── domain/model/
│   └── my-entity.entity.js
├── infrastructure/
│   ├── my-context-api.js
│   └── my-entity.assembler.js
└── presentation/
    ├── components/
    └── views/
        └── my-context.vue
```

### 2. Domain Entity

```js
export class MyEntity {
    constructor({ id, name }) {
        this.id   = id;
        this.name = name;
    }
}
```

### 3. Assembler

```js
import { MyEntity } from '../domain/model/my-entity.entity.js';
export class MyEntityAssembler {
    static toEntity(r)    { return new MyEntity(r); }
    static toEntities(rs) { return rs.map(MyEntityAssembler.toEntity); }
}
```

### 4. API (extends BaseEndpoint)

For a standard collection resource:

```js
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { MyEntityAssembler } from './my-entity.assembler.js';

class MyContextApi extends BaseEndpoint {
    constructor() { super(import.meta.env.VITE_MY_CONTEXT_ENDPOINT_PATH); }
    async getAll() {
        const data = await super.getAll();
        return MyEntityAssembler.toEntities(data);
    }
}
export const myContextApi = new MyContextApi();
```

For a singleton resource, keep the same inheritance but expose explicit methods (for example `getSettings()` / `updateSettings()`) and call `this.api` with `this.resourcePath`.

### 5. Pinia Store

```js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { myContextApi } from '../infrastructure/my-context-api.js';

export const useMyContextStore = defineStore('my-context', () => {
    const items   = ref([]);
    const loading = ref(false);
    async function fetchAll() {
        loading.value = true;
        try { items.value = await myContextApi.getAll(); }
        finally { loading.value = false; }
    }
    return { items, loading, fetchAll };
});
```

### 6–9. Checklist

- [ ] Register route in `src/router.js`
- [ ] Add seed data to `server/db.json`
- [ ] Add `VITE_MY_CONTEXT_ENDPOINT_PATH` to `.env.development` and `.env.production`
- [ ] Add translation keys to `en.json` and `es.json`

---

## Team Conventions

- **One bounded context per module** — never import across bounded contexts (use `shared/` only).
- **Build API modules on top of `BaseEndpoint`** — for singleton resources, custom methods may use `this.api` while preserving the shared base pattern.
- **Always use assemblers** — never bind raw API responses to the UI.
- **Always translate** — add keys to both `en.json` and `es.json`.
- **Seed data first** — add your resource to `server/db.json` before implementing the API.
- **Commit structure**: `feat(context-name): description` / `fix(context-name): description`
