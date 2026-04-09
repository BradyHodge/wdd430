import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/items';

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.base);
  }

  getOne(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.base}/${id}`);
  }

  create(body: Pick<Item, 'title' | 'description' | 'done'>): Observable<Item> {
    return this.http.post<Item>(this.base, body);
  }

  update(
    id: string,
    body: Partial<Pick<Item, 'title' | 'description' | 'done'>>,
  ): Observable<Item> {
    return this.http.put<Item>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
