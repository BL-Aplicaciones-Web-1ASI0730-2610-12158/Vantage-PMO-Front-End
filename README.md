# Vantage PMO — Front End

> **Precision Architect** · Project Management Office Platform

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
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

Vantage PMO is a web-based Project Management Office platform that gives executive teams a real-time view of portfolio health, active projects, team performance, scheduling, and reporting.

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
└── infrastructure/
    ├── *-api.js        # Extends BaseEndpoint, maps via assemblers
    ├── *.assembler.js  # Maps raw API response → domain entity
    └── *.entity.js     # (optionally co-located)
```

### Shared Kernel

The `shared/` module provides the infrastructure foundation used by **all** bounded contexts:

- `base-api.js` — Axios instance configured from `.env`
- `base-endpoint.js` — Generic CRUD class (`getAll`, `getById`, `getByQuery`, `create`, `update`, `delete`)

Every bounded context API class **extends `BaseEndpoint`** and uses its own assembler to convert raw data into domain entities.

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
│   ├── application/
│   ├── domain/model/
│   └── infrastructure/
│
├── profile/                      ← User Profile
│   ├── application/
│   │   └── profile.store.js
│   ├── domain/model/
│   │   ├── profile.entity.js
│   │   └── stats.entity.js
│   └── infrastructure/
│       ├── profile-api.js
│       ├── profile.assembler.js
│       └── stats.assembler.js
│
├── [future-context]/             ← Next bounded contexts
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
├── db.json           ← Fake database
├── routes.json       ← Route mappings (/api/v1/* → /*)
└── start.sh          ← Start JSON Server

.env.development      ← Local API config
.env.production       ← Production API config
```

---

## Bounded Contexts

| Context | Status | Description |
|---|---|---|
| `shared` | Active | Layout, base infrastructure, dashboard |
| `profile` | Active | User profile and portfolio stats |
| `iam` | Pending | Authentication & authorization |
| `active-projects` | Pending | Project tracking and status |
| `team` | Pending | Team members and roles |
| `schedule` | Pending | Calendar and scheduling |
| `meetings` | Pending | Meeting management |
| `reports` | Pending | Analytics and reporting |
| `chat-hub` | Pending | Internal messaging |

> New bounded contexts are added incrementally by the team. See [Adding a New Bounded Context](#adding-a-new-bounded-context).

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- JSON Server 0.17.x installed globally
### Installation

```bash
# Install dependencies
npm install
```

### Running the App

You need **two terminals** — one for the fake API and one for the app:

```bash
# Terminal 1 — Start the fake API server
cd server
sh start.sh
```

```bash
# Terminal 2 — Start the Vue app
npm run dev
```

App will be available at: `http://localhost:5173`  
API will be available at: `http://localhost:3000/api/v1`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the API | `http://localhost:3000/api/v1` |
| `VITE_USERS_ENDPOINT_PATH` | Users resource path | `/users` |
| `VITE_STATS_ENDPOINT_PATH` | Stats resource path | `/stats` |
| `VITE_TASKS_ENDPOINT_PATH` | Tasks resource path | `/tasks` |
| `VITE_SCHEDULE_ENDPOINT_PATH` | Schedule resource path | `/schedule` |
| `VITE_DEPARTMENTS_ENDPOINT_PATH` | Departments resource path | `/departments` |

> Add new endpoint variables here as new bounded contexts are integrated.

---

## Fake API Server

The project uses [JSON Server](https://github.com/typicode/json-server) `v0.17.x` as a fake REST API during development.

```bash
cd server
sh start.sh
# Runs: json-server --watch db.json --routes routes.json --port 3000
```

The `routes.json` maps `/api/v1/*` → `/*` so the app can use versioned API paths:

```
GET /api/v1/users       →   /users
GET /api/v1/tasks       →   /tasks
GET /api/v1/stats       →   /stats
...
```

> When new bounded contexts are added, include their seed data in `server/db.json`.

---

## Internationalization

The app supports **English (en)** and **Spanish (es)** via Vue I18n.

Translation files are located in `src/locales/`:

```
src/locales/
├── en.json
└── es.json
```

Translations are organized by section:

```json
{
  "app": { ... },
  "nav": { ... },
  "topbar": { ... },
  "home": { ... },
  "profile": { ... }
}
```

> When adding a new bounded context, add its translation keys to **both** `en.json` and `es.json`.

The language switcher is available in the top bar of the app.

---

## Adding a New Bounded Context

Follow these steps to add a new bounded context to the project:

### 1. Create the folder structure

```bash
src/
└── my-context/
    ├── application/
    │   └── my-context.store.js
    ├── domain/
    │   └── model/
    │       └── my-entity.entity.js
    └── infrastructure/
        ├── my-context-api.js
        └── my-entity.assembler.js
```

### 2. Define the Domain Entity

```js
// domain/model/my-entity.entity.js
export class MyEntity {
    constructor({ id, name }) {
        this.id   = id;
        this.name = name;
    }
}
```

### 3. Create the Assembler

```js
// infrastructure/my-entity.assembler.js
import { MyEntity } from '../domain/model/my-entity.entity.js';

export class MyEntityAssembler {
    static toEntity(r)    { return new MyEntity(r); }
    static toEntities(rs) { return rs.map(MyEntityAssembler.toEntity); }
}
```

### 4. Create the API (extends BaseEndpoint)

```js
// infrastructure/my-context-api.js
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

### 5. Create the Pinia Store

```js
// application/my-context.store.js
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

### 6. Register the route

Add the route in `src/router.js` under the layout children.

### 7. Add seed data

Add the resource collection to `server/db.json`.

### 8. Add the env variable

Add `VITE_MY_CONTEXT_ENDPOINT_PATH="/my-context"` to both `.env.development` and `.env.production`.

### 9. Add translations

Add the translation keys to `src/locales/en.json` and `src/locales/es.json`.

---

## Team Conventions

- **One bounded context per module** — never import across bounded contexts directly (use shared only).
- **Always extend `BaseEndpoint`** — do not create standalone Axios calls.
- **Always use assemblers** — never bind raw API responses to the UI.
- **Always translate** — add keys to both `en.json` and `es.json` when adding UI text.
- **Seed data first** — add your resource to `server/db.json` before implementing the API call.
- **Commit structure**: `feat(context-name): description` / `fix(context-name): description`

---

