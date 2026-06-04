import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsMeal } from '../details-meal/details-meal';
import { DetailsSave } from '../details-save/details-save';

@Component({
  selector: 'app-details',
  imports: [DetailsMeal, DetailsSave],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  mealId = signal<number | null>(null);
  isSaved = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.mealId.set(Number(id));
  }

}
