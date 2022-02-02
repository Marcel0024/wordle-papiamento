import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from './components/dialog/dialog.component';
import { IntroDialogComponent } from './components/intro-dialog/intro-dialog.component';
import { GameStatus, Grid } from './interfaces/state';
import { FoundLetter, GameService } from './services/game.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  gameStatus = GameStatus.ONGOING;
  gameStatusEnum = GameStatus;

  foundLetters: FoundLetter[] = [];

  constructor(
    public readonly gameService: GameService,
    public readonly stateService: StateService,
    public readonly dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.stateService.getViewedInstructions()) {
      this.stateService.updateViewInstructions(true);
      this.openInstructionsDialog();
    }

    this.gameService.gameStatus$.subscribe((x) => (this.gameStatus = x));
    this.gameService.foundLetters$.subscribe((x) => (this.foundLetters = x));
    this.gameService.init();
  }

  onDisplayKeyboardClick(letter: string): void {
    if (letter === 'BACK') {
      this.gameService.backspace();
    } else if (letter === 'ENTER') {
      this.gameService.enter();
    } else {
      this.gameService.typeLetter(letter);
    }
  }

  @HostListener('document:keydown', ['$event'])
  realKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.gameService.backspace();
    } else if (event.key === 'Enter') {
      this.gameService.enter();
    } else {
      if (event.key.length === 1) {
        this.gameService.typeLetter(event.key.toUpperCase());
      }
    }
  }

  startNewGame(): void {
    this.gameService.init(true);
  }

  startNewGameWithPrompt(): void {
    if (!confirm('Cuminsa cu un palabra nobo?')) {
      return;
    }

    const word = this.gameService.getWord();

    this.dialog.open(DialogComponent, {
      data: {
        title: 'Game Over!',
        text: `Lastima! E palabra tawata '${word}'. Purba bo suerte next time!`,
      },
    });

    this.gameService.init(true);
  }

  openInstructionsDialog(): void {
    this.dialog.open(IntroDialogComponent);
  }

  copy(): void {
    navigator.clipboard.writeText(this.gameService.toCopyText());

    this._snackBar.open('Copied to clipboard!');
  }

  keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'Ñ', 'M'],
    ['ENTER', 'BACK'],
  ];
}
