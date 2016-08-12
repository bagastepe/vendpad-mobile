import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
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
  constructor(private nav: NavController,
              private navParams:NavParams, 
              private data:Data,
              private alertCtrl:AlertController) {
    this.local = new Storage(LocalStorage);
  }

  //
  ionViewLoaded(){
    this.local.get('cart').then(data=>{
      this.temp=data
      this.cartProducts=JSON.parse(this.temp)
      console.log(this.cartProducts)
      if(this.cartProducts==null){this.cartProducts=[]}
      console.log(JSON.stringify(this.cartProducts))
    })
  }

  //delete produk dari cart
  delete(id){
    this.data.delete(id).then(
      ()=>{
        this.local.get('cart').then(data=>{
            this.temp=data
            this.cartProducts=JSON.parse(this.temp)
            if(this.cartProducts==null){this.cartProducts=[]}        
            console.log(this.cartProducts)
        })
      }
    )
    
  }

  clearCart(){
    let confirm = this.alertCtrl.create({
      title:'Kosongkan Keranjang',
      message:'Apakah anda yakin untuk mengosongkan keranjang?',
      buttons:[
        {
          text:'Tidak',
          handler:()=>{
            console.log()
          }
        },
        {
          text:'Ya',
          handler:()=>{
            this.data.clearCart();
            this.local.remove('cart');
            this.local.get('cart').then(data=>{
              this.temp=data
              this.cartProducts=JSON.parse(this.temp)
              if(this.cartProducts==null){this.cartProducts=[]}      
              console.log(this.cartProducts)
            })
          }
        }
      ]
    })

    confirm.present();
  }

  gotoOrder(){
    this.nav.push(OrderPage)
  }

  //coba
  testChange(product){
    console.log(product.product_qty)
    console.log(product)
    for(let p of this.cartProducts){
      if(p.product_id==product){
        p.product_qty=product.product_qty
      }
    }
    this.local.set('cart',JSON.stringify(this.cartProducts))
  }



}
