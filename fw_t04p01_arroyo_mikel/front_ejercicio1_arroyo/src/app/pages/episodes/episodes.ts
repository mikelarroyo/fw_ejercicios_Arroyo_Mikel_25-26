import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DragonBall } from '../../services/dragon-ball';
@Component({
  selector: 'app-episodes',
  imports: [],
  templateUrl: './episodes.html',
  styleUrl: './episodes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Episodes {
  dragonBallService = inject(DragonBall);
  episodes = signal<any[]>([]);
  selectedEpisode = signal<any>(null);

  constructor(){
    this.loadEpisodes();

  }
  loadEpisodes(){
    this.dragonBallService.getEpisodes().subscribe((data:any)=>{
      this.episodes.set(data);
    });
  }
  openModal(id: string) {
  this.dragonBallService.getEpisodeById(id).subscribe((data: any) => {
    this.selectedEpisode.set(data);
    const modal = document.getElementById('episode_modal') as HTMLDialogElement;
    modal.showModal();
  });
}

}

