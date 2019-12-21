import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadlines } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUlr;

const headers = new HttpHeaders({
  'X-Api-Key': apiKey
});

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  headlinesPage = 0;

  categoriaActual = '';
  categoriaPage = 0;

  constructor( private http: HttpClient ) { }

  private ejecutarQuery<T>( query: string ){
    query = apiUrl + query;

    return this.http.get<T>( query, {headers} );
  }

  getTopHeadlines() {
    this.headlinesPage++;
    return this.ejecutarQuery<RespuestaTopHeadlines>(`/everything?q=bitcoin&from=2019-11-20&sortBy=publishedAt&page=${this.headlinesPage}`);
    // return this.http.get<RespuestaTopHeadlines>(`https://newsapi.org/v2/everything?q=bitcoin&from=2019-11-20&sortBy=publishedAt&apiKey=de844b065137430db672a6059dd033bc`)
  }

  getTopHeadlinesCategoria( categoria: string ){
    if( this.categoriaActual === categoria ){
      this.categoriaPage++;
    }else{
      this.categoriaPage = 1;
      this.categoriaActual = categoria;
    }
    return this.ejecutarQuery<RespuestaTopHeadlines>(`/top-headlines?country=us&category=${categoria}&page=${this.categoriaPage}`);
    // return this.http.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=de844b065137430db672a6059dd033bc`)
  }

}
