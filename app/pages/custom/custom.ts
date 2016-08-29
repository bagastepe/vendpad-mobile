import { Component } from '@angular/core';
import { NavController, NavParams,Storage,LocalStorage } from 'ionic-angular';
import {CartPage} from '../cart/cart'

/*
  Generated class for the CustomPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/custom/custom.html',
})
export class CustomPage {
  pageBody:any
  local;
  totalCart=0;
  constructor(private nav: NavController, private navParams: NavParams) {
    this.pageBody=this.navParams.get('parameter')
    this.local=new Storage(LocalStorage)

  }
  ionViewLoaded(){
    this.updateCartLabel()
  }

  gotoCart(){
    this.nav.push(CartPage)
  }


  updateCartLabel(){
    this.local.get('cart').then(data=>{
          if(data!=null){this.totalCart=JSON.parse(data).length}
          else{this.totalCart=0}
        })
  }
}
