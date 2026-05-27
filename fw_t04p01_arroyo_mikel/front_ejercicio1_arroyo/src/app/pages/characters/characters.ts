import { Component,inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DragonBall } from '../../services/dragon-ball';

@Component({
  selector: 'app-characters',
  imports: [],
  templateUrl: './characters.html',
  styleUrl: './characters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Characters {
  dragonBallService = inject(DragonBall);
  characters = signal<any[]>([]);
  currentPage = signal(1);
  pages = signal<number[]>([]);

  constructor() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.dragonBallService.getCharacters(this.currentPage()).subscribe((data: any) => {
      this.characters.set(data.characters);
      const total = Math.ceil(data.total / data.limit);
      this.pages.set(Array.from({ length: total }, (_, i) => i + 1));
    });
  }
  goToPage(page: number){
    this.currentPage.set(page);
    this.loadCharacters();
  }

  


}
