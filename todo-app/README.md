# Accenture Technical Test — To-Do App (Ionic + Angular + Cordova)

Hybrid To-Do application built with Ionic + Angular and packaged with Cordova for Android/iOS.
It includes local persistence, task categorization and filtering, and feature flags using Firebase Remote Config.

## Features

- Create tasks
- Mark tasks as completed
- Delete tasks (enabled/disabled via feature flag)
- Categories (assign on creation) + filter by category (enabled/disabled via feature flag)
- Status filter: All / Active / Completed
- Local persistence with Ionic Storage
- Feature flags with Firebase Remote Config:
  - enable_categories
  - enable_delete

## Firebase Remote Config (Feature Flags)

Create and publish these boolean parameters in Firebase Remote Config:

- enable_categories
  - true: shows category selector and category filter
  - false: hides category selector and filter
- enable_delete
  - true: enables delete action
  - false: hides delete action

The app includes default values so it still works if Remote Config fails or the device is offline.

## Evidence

Screenshots/videos are located in:

- evidence/

---

# 1) Prerequisites

## 1.1 Common prerequisites (Windows and macOS)

- Node.js + npm
- Git
- Ionic CLI
- Cordova CLI

Global install (if needed):

```bash
npm i -g @ionic/cli cordova
```
