import { Injectable } from '@angular/core';
import { Grid } from '../interfaces/state';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  localStorageKey: string = 'usersettings2';
  private state!: SettingsState;

  constructor() {
    this.getOrCreateState();
  }

  getLatestState(): SettingsState {
    return this.state;
  }

  getGrid(): Grid | undefined {
    return this.state.grid;
  }

  getViewedInstructions(): boolean {
    return this.state.user.viewedInstructions;
  }

  updateViewInstructions(viewed: boolean): void {
    this.state.user.viewedInstructions = viewed;
    this.saveSettingsAndBroadcast();
  }

  updateGrid(grid: Grid): void {
    this.state.grid = grid;
    this.saveSettingsAndBroadcast();
  }

  updateGameStats(won: boolean): void {
    this.state.user.totalGamesPlayed++;

    if (won) {
      this.state.user.totalGamesWon++;
    } else {
      this.state.user.totalGamesLost++;
    }
    this.saveSettingsAndBroadcast();
  }

  getOrCreateState(): SettingsState {
    var settings = localStorage.getItem(this.localStorageKey);

    if (settings === undefined || settings === null) {
      this.createDefaultSettings();
    } else {
      try {
        this.state = JSON.parse(settings);
      } catch {
        this.createDefaultSettings();
      }
    }

    return this.state;
  }

  private createDefaultSettings(): void {
    this.state = {
      grid: undefined,
      user: {
        viewedInstructions: false,
        totalGamesLost: 0,
        totalGamesPlayed: 0,
        totalGamesWon: 0,
      },
    };

    this.saveSettingsAndBroadcast();
  }

  private saveSettingsAndBroadcast(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
  }
}

export interface SettingsState {
  grid: Grid | undefined;
  user: UserSettings;
}

export interface UserSettings {
  viewedInstructions: boolean;
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalGamesLost: number;
}
