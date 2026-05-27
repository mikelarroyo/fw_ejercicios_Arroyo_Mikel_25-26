import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DragonBall {
  private http = inject(HttpClient);
  private apiUrl = 'https://dragonball-api-production.up.railway.app/api';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNmExMDNjNmVhMTkyNDcyZDg4NWUzMGMzIiwiaWF0IjoxNzc5ODc3ODM4LCJleHAiOjE3ODI0Njk4Mzh9.RrQUOsmPM4FXVS6F4N0qENSUmGVAY_xy73mp84y1-jE';

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
