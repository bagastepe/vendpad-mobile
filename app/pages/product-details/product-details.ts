import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  constructor(private nav: NavController, 
              private NavParams : NavParams,
              private toast:ToastController,
              private data: Data) 
  {
    this.product=this.NavParams.get('details');
    // this.varian = {id:this.product.id,name:this.product.name,varian:this.product.varian[0].value,photo:this.product.photo,price:this.product.price};
  }

  gotoCart(){
    this.nav.push(CartPage)
  }

  addCart(){
    if(this.varian){
      
      console.log('Varian details : '+this.varian)
      this.data.storeProduct(this.varian)
      this.presentToast(this.varian.name+' ditambahkan ke keranjang');
      
      // console.log('product_id : '+this.varian.id+'; product_name : '+ this.varian.name+'; varian: '+this.varian.varian +'; product_image: '+this.varian.photo+'; product_price :'+this.varian.price);
    }
    else{
      this.presentToast('Silahkan pilih varian');
    }
  }

  presentToast(text) {
    let toast = this.toast.create({
      message: text,
      duration: 3000,
      showCloseButton: true
    });
    toast.present();
  }
}
