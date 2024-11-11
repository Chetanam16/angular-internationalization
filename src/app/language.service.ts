import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DataInterface, FormDetails } from './data-interface';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public dataUrl = 'http://localhost:3000/form';
  constructor(private http: HttpClient) {}
  getData(): Observable<DataInterface> {
    return this.http.get<DataInterface>(this.dataUrl);
  }

  getFormData(): Observable<FormDetails[]> {
    return this.http.get<FormDetails[]>(this.dataUrl);
  }

  postData(data: any): Observable<FormDetails> {
    return this.http.post<any>(this.dataUrl, data);
  }

  deleteFormData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.dataUrl}/${id}`);
  }

  private currentLang = new BehaviorSubject<string>('en');
  lang$ = this.currentLang.asObservable();
  switchLanguage(lang: string) {
    this.currentLang.next(lang);
  }
}
