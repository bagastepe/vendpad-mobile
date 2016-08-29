import { Component } from '@angular/core';
import { NavController,Storage,LocalStorage,Platform } from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';
import { LocaleService,LocalizationService,TranslatePipe,LocaleDatePipe} from 'angular2localization/angular2localization';
import {CartPage} from '../cart/cart'
import { Vars } from '../../vars';


@Component({
  templateUrl: 'build/pages/invoice/invoice.html',
  pipes:[TranslatePipe,LocaleDatePipe]
})
export class InvoicePage {
  asd=false
  local;
  orderCode;
  tmp;
  incr;
  canLoad;
  totalCart=0;
  constructor(private navCtrl: NavController,private platform: Platform,private locale:LocaleService,private localization:LocalizationService) {
    this.local=new Storage(LocalStorage)
    this.orderCode=[]
    this.incr=0
    this.canLoad=true
  }
  
  // Gets the language code for the LocalizationService.
  get lang(): string {

      return this.localization.languageCode;

  }
  // Gets the default locale.
  get defaultLocale(): string {

      return this.locale.getDefaultLocale();

  }

  
  ionViewWillEnter(){
    this.updateCartLabel()
    this.local.get('invoice').then(data=>{
        if(data!=null){
          this.tmp = JSON.parse(data);
          console.log(this.tmp)
          if(this.tmp.length>0){
            if(this.tmp.length>8){
              for(this.incr; this.incr<8; this.incr++){
                console.log(this.incr)
                this.orderCode.push(this.tmp[this.incr]);
              }
            }
            else{
              for(this.incr; this.incr<this.tmp.length; this.incr++){
                console.log(this.incr)
                this.orderCode.push(this.tmp[this.incr]);
                this.canLoad=false
              }
            }
          }
          else{
            this.canLoad=false
          }
      }
      else{
            this.canLoad=false        
      }
        

    })
  }

  

  //buka detail invoice web
  detailOrderWeb(invoice){
    var url = "http://"+Vars.URL+"/i/"+invoice.kode 
    console.log(url)
    this.platform.ready().then(()=>{
      InAppBrowser.open(url,"_system","location=yes");
      // window.location.href="http://"+Vars.URL+"/i/"+invoice.kode;
    })
  }

  updateCartLabel(){
    this.local.get('cart').then(data=>{
          if(data!=null){this.totalCart=JSON.parse(data).length}
          else{this.totalCart=0}
        })
  }

  gotoCart(){
    this.navCtrl.push(CartPage)
  }

  doInfinite(infiniteScroll) {
    var x
    console.log('loader async')
    setTimeout(()=>{
      this.local.get('invoice').then(data=>{
        this.tmp = JSON.parse(data);
        if(this.tmp.length-this.incr>5){
          x = this.incr+5
          for(this.incr; this.incr<x; this.incr++){
            console.log(this.incr)
            this.orderCode.push(this.tmp[this.incr]);
          }
        }
        else{
          x = this.tmp.length 
          for(this.incr; this.incr<x; this.incr++){
            console.log(this.incr)
            this.orderCode.push(this.tmp[this.incr]);
          }
          this.canLoad=false
        }
        infiniteScroll.complete();
      })
    },1000)
  }

}
  