import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Article } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // @ViewChild(IonSegment, {}) segment: IonSegment;
  categorias = ["business","entertainment","general","health","science","sports","technology"];
  select_categoria:string;
  noticias: Article[]=[];

  constructor(
    private noticiasServices: NoticiasService
  ) {}

  ngOnInit(){
    this.select_categoria = this.categorias[0];
    this.cargarNoticas(this.categorias[0]); 
    // this.segment.value = this.categorias[0];
  }
  cambioCategoria( event ){
    this.noticias = [];
    this.select_categoria = event.detail.value;
    this.cargarNoticas(event.detail.value);
  }
  cargarNoticas( categoria: string, event? ){
    console.log(categoria)
    this.noticiasServices.getTopHeadlinesCategoria( categoria )
    .subscribe(resp =>{
      console.log(resp);
      this.noticias.push(...resp.articles );
      if( event ){
        event.target.complete()
      }
    });
  }
  loadData( event ){
    this.cargarNoticas(this.select_categoria, event);
  }

}
