import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DragonBall {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNmExMDNjNmVhMTkyNDcyZDg4NWUzMGMzIiwiaWF0IjoxNzc5ODY5NzUzLCJleHAiOjE3ODA0NzQ1NTN9.qyQ0XNbwN8WY_QWFR52l8Zl3oRkfk4n8Ig6ePPiZg4s';

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  getCharacters(page: number = 1) {
    return this.http.get(`${this.apiUrl}/characters?page=${page}&limit=4`, { headers: this.headers });
  }

  getEpisodes() {
    return this.http.get(`${this.apiUrl}/episodes`, { headers: this.headers });
  }

  getEpisodeById(id: string) {
    return this.http.get(`${this.apiUrl}/episodes/${id}`, { headers: this.headers });
  }
}
