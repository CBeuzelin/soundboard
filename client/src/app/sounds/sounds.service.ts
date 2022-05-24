import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUser } from '../../../../api/src/modules/user/resources/interfaces/user.interface';

interface ISound {
  title: string;
  tags: string[];
  createdAt: Date;
  author: IUser;
}

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  constructor(private http: HttpClient) {}

  getSounds(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/sounds`);
  }

  createSound(): Observable<ISound> {
    return this.http.post<ISound>(`${environment.apiBaseUrl}/sounds`, {});
  }
}
