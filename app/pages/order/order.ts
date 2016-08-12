import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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


/*
  Generated class for the OrderPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/order/order.html',
})
export class OrderPage {

  constructor(private navCtrl: NavController) {

  }
  customer= new Customer('bagastepe@gmail.com','bagas','089898989','08989899','asdadsa')
  delivery = new Delivery('bagas','089898989','semanggi','asasasas')
  
  public get diagnostic() : string {
    var arr : Array<any> = []
    arr.push(this.customer)
    arr.push(this.delivery)
    return JSON.stringify(arr);
  }

  submitted = false;
  
  onSubmit() { this.submitted = true; }
  
}