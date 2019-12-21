import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticias: Article;
  @Input() indice: Number;
  @Input() enFavoritos;

  constructor(
    private iab: InAppBrowser,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private datalocalService: DataLocalService,
    public toastCtrl: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {}

  abrirNoticia(noticias:any){
    console.log("noticia", this.noticias.url);
    const browser = this.iab.create(this.noticias.url, '_system');
  }
  async lanzarMenu(){

    let guardarBorrarBtn;

    if( this.enFavoritos ){
      guardarBorrarBtn = {
        text: 'BorrarFavorito',
        icon: 'trash',
        cssClass: "action-dark",
        handler: () => {
          console.log('Borrar de Favorite clicked');
          this.datalocalService.borrarNoticia( this.noticias );
          this.presentToast('Eliminado de Favorito');
        }
      };
    }else{
      guardarBorrarBtn = {
        text: 'Favorito',
        icon: 'heart',
        cssClass: "action-dark",
        handler: () => {
          console.log('Favorite clicked');
          this.datalocalService.guardarNoticia( this.noticias );
          this.presentToast('Agregado a Favorito');
        }
      };
    }

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Compartir',
        icon: 'share',
        cssClass: "action-dark",
        handler: () => {
          console.log('Share clicked');
          this.compartirNotica();
          this.presentToast('compartido');
        }
      },guardarBorrarBtn, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass: "action-dark",
        handler: () => {
          console.log('Cancelar clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async presentToast(txt:string) {
    const toast = await this.toastCtrl.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }

  compartirNotica(){
    if( this.platform.is('cordova') ){
      this.socialSharing.share(
        this.noticias.title,
        this.noticias.source.name,
        '',
        this.noticias.url
      );
    }else{
      if (navigator['share']) {
        navigator['share']({
          title: this.noticias.title,
          text: this.noticias.description,
          url: this.noticias.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }else console.log("no se pudo compartir porque no se soporta");
    }
  }
}
