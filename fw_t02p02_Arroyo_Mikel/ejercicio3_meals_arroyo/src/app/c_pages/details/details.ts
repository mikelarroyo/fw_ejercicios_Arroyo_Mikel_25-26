import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsMeal } from '../details-meal/details-meal';

@Component({
  selector: 'app-details',
  imports: [DetailsMeal],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  mealId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.mealId.set(Number(id));
  }
}
