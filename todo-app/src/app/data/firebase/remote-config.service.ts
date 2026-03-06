import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { initializeApp, getApps } from 'firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getBoolean,
  RemoteConfig,
} from 'firebase/remote-config';
import { environment } from '../../../environments/environment';

export type FeatureFlags = {
  enable_categories: boolean;
  enable_delete: boolean;
};

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private rc!: RemoteConfig;

  private flagsSubject = new BehaviorSubject<FeatureFlags>({
    enable_categories: true,
    enable_delete: true,
  });

  readonly flags$ = this.flagsSubject.asObservable();

  async init(): Promise<void> {
    // Evita inicializar Firebase dos veces
    if (getApps().length === 0) {
      initializeApp(environment.firebaseConfig);
    }

    // Remote Config
    this.rc = getRemoteConfig();

    // Defaults (si no hay conexión o aún no publicas)
    this.rc.defaultConfig = {
      enable_categories: true,
      enable_delete: true,
    };

    // Ajustes recomendados (dev)
    this.rc.settings = {
      minimumFetchIntervalMillis: 10_000, // 10s para probar rápido
      fetchTimeoutMillis: 10_000,
    };

    try {
      await fetchAndActivate(this.rc);
    } catch {
      // Si falla, seguimos con defaults (no rompemos la app)
    }

    const flags: FeatureFlags = {
      enable_categories: getBoolean(this.rc, 'enable_categories'),
      enable_delete: getBoolean(this.rc, 'enable_delete'),
    };

    this.flagsSubject.next(flags);
  }
}