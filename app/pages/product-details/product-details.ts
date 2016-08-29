import { Component } from '@angular/core';
import { NavController, NavParams,Storage,LocalStorage } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Data} from '../../providers/data/data';
import {CartPage} from '../cart/cart';


/*
  Generated class for the ProductDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/product-details/product-details.html',
})
export class ProductDetailsPage {
  varian;
  product;
  totalCart=0;
  local;
  constructor(private nav: NavController, 
              private navParams : NavParams,
              private toast:ToastController,
              private data: Data) 
  {
    this.product=this.navParams.get('details');
    // this.varian = {id:this.product.id,name:this.product.name,varian:this.product.varian[0].value,photo:this.product.photo,price:this.product.price};
    this.local=new Storage(LocalStorage)
  }

  onPageWillEnter(){
    this.updateCartLabel()
  }

  gotoCart(){
    this.nav.push(CartPage)
  }

  addCart(){
    if(this.varian){
      
      console.log('Varian details : '+this.varian)
      this.data.storeProduct(this.varian).then(()=>{
        this.presentToast(this.varian.name+' ditambahkan ke keranjang');
        this.updateCartLabel();
      })
      
      
      // console.log('product_id : '+this.varian.id+'; product_name : '+ this.varian.name+'; varian: '+this.varian.varian +'; product_image: '+this.varian.photo+'; product_price :'+this.varian.price);
    }
    else{
      this.presentToast('Silahkan pilih varian');
    }
  }

  presentToast(text) {
    let toast = this.toast.create({
      message: text,
      showCloseButton: true
    });
    toast.present();
  }

  updateCartLabel(){
    this.local.get('cart').then(data=>{
          data!=null? this.totalCart=JSON.parse(data).length : this.totalCart=0
        })
  }
}
