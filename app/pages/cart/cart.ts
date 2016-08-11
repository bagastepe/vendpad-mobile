import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {Data} from '../../providers/data/data'
import { Storage, LocalStorage } from 'ionic-angular';
import {OrderPage} from '../order/order';


/*
  Generated class for the CartPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/cart/cart.html',
})
export class CartPage {
  temp
  local
  cartProducts
  constructor(private nav: NavController, private navParams:NavParams, private data:Data) {
    this.local = new Storage(LocalStorage);
  }

  ionViewLoaded(){
    this.local.get('cart').then(data=>{
      this.temp=data
      this.cartProducts=JSON.parse(this.temp)
      console.log(this.cartProducts)
    })
  }

  clearCart(){
    this.data.clearCart();
    this.local.remove('cart');
    this.local.get('cart').then(data=>{
      this.temp=data
      this.cartProducts=JSON.parse(this.temp)
      console.log(this.cartProducts)
    })
  }

  gotoOrder(){
    this.nav.push(OrderPage)
  }


}
