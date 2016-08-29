import { Component } from '@angular/core';
import { NavController,NavParams,Platform,ToastController,Storage, LocalStorage,LoadingController,AlertController } from 'ionic-angular';
import { InAppBrowser} from 'ionic-native';
import { Data } from '../../providers/data/data';
import {InvoicePage} from '../invoice/invoice';
import {ProductsPage} from '../products/products';
import {Vars} from '../../vars'

class Customer{
  constructor(
    public email:string,
    public name:string,    
    public phone:string,
    public wa?:string,
    public line?:any
  ){}
}

class Delivery{
  constructor(
    public name:string,
    public phone:string,
    public address:string,
    public note?:string
  )
  {}
}

@Component({
  templateUrl: 'build/pages/order/order.html',
})
export class OrderPage {
  tmp
  local
  orderJson
  orderData
  constructor(private navCtrl: NavController,
              private navParams :NavParams,
              private platform:Platform,
              private toastCtrl:ToastController,
              private data: Data,
              private loadingCtrl:LoadingController,
              private alertCtrl:AlertController) {
    this.orderJson=this.navParams.get('order_data')
    this.orderJson=JSON.stringify(this.orderJson)
    this.local = new Storage(LocalStorage);
    console.log(this.orderJson)

  }
  customer= new Customer('','','','','')
  delivery = new Delivery('','','','')

  submitted = false;

  onSubmit(data,isValid) { 
    this.submitted = true;
    this.orderData=data;
    this.orderData.order_json=this.orderJson
    console.log(this.orderData)
    if(isValid){
      //loading
      var loading = this.loadingCtrl.create({
        content:"Please Wait"
      })

      loading.present()
      
      //requesting
      this.data.webOrder(data).then(data=>{
        console.log(data)
        if (data=="error"){
          console.log(data)
          setTimeout(()=>{
            loading.dismiss()
          },100)
          var alert = this.alertCtrl.create({
            title: 'Not Connected',
            subTitle: 'Order Failed',
            buttons: ['Dismiss']
          })
          setTimeout(()=>{
            alert.present();
            
          },500)
        }        
        else{
          this.tmp=data
          setTimeout(()=>{
            loading.dismiss()
          },100)
          console.log('finished')
          var url="http://"+Vars.URL+"/i/"+this.tmp.order_code;
          var tgl = Date.now()
          console.log(tgl)
          var detail = {kode:this.tmp.order_code,tanggal:tgl}
          let toast = this.toastCtrl.create({
            message: "Order Berhasil, Tunggu admin menyelesaikan order anda",
            showCloseButton: true
          })
          toast.present()
          this.local.remove('cart')
          this.data.storeInvoice(detail)
          this.navCtrl.setRoot(InvoicePage)
          // this.loadUrl(url)
        }
      })
    
    }
    else{
      let toast = this.toastCtrl.create({
        message: "Error : Mohon cek kembali detail order anda",
        duration: 4000,
        position: "middle",
        showCloseButton: true
      })
      toast.present()
      
    }
  }

  
  loadUrl(url){
    this.platform.ready().then(()=>{
      InAppBrowser.open(url,"_system","location=yes");
    })
  }
}