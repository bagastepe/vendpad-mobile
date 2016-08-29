import { Component,Input } from '@angular/core';
import { NavController,NavParams,AlertController,ToastController } from 'ionic-angular';
import {Data} from '../../providers/data/data'
import { Storage, LocalStorage } from 'ionic-angular';
import {OrderPage} from '../order/order';


@Component({
  templateUrl: 'build/pages/cart/cart.html',
})
export class CartPage {
  temp
  local
  cartProducts
  totalBayar
  constructor(private nav: NavController,
              private navParams:NavParams, 
              private data:Data,
              private alertCtrl:AlertController,
              private toastCtrl:ToastController) {
    this.local = new Storage(LocalStorage);
    this.totalBayar=0;
  }

  //
  onPageWillEnter(){
    this.getCart()
  }


  getTotalBayar(){
    this.totalBayar=0;
    for (let p of this.cartProducts){
        var h = parseInt(p.product_price.replace(',',''))
        var harga = h*p.product_qty;
        this.totalBayar+=harga
      }
      console.log("Tohtal bayar "+this.totalBayar)
  }
  //load data dari LocalStorage
  getCart(){
    this.local.get('cart').then(data=>{
      this.temp=data
      this.cartProducts=JSON.parse(this.temp)
      console.log(this.cartProducts)
      if(this.cartProducts==null){this.cartProducts=[]}
      console.log(JSON.stringify(this.cartProducts))
      this.getTotalBayar();
    })
  }

  //delete produk dari cart
  delete(id){
    this.data.delete(id).then(
      ()=>{
        this.getCart();
      }
    )
    
  }

  //hapus cart
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

  //ke page Order
  gotoOrder(){
    if(this.cartProducts&&this.cartProducts.length>0)
    this.nav.push(OrderPage,{
      order_data:this.cartProducts
    })
    else{
      let toast = this.toastCtrl.create({
        message: "Keranjang Kosong",
        duration: 1000,
        showCloseButton: true
      })
      toast.present()
    }
  }

  //ubah QTY
  onChangeInput(e,product){
    if(product.product_qty!=null){
      console.log(product.product_qty)
      console.log(product)
      for(let p of this.cartProducts){
        if(p.product_id==product){
          p.product_qty=product.product_qty
        }
      }
      this.local.set('cart',JSON.stringify(this.cartProducts))
      this.getTotalBayar();
    }
  }
  


}
