import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Vars } from '../../vars';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {
  data: any;
  local;
  temp=[];
  constructor(private http: Http) {
    this.data = null;
    this.local = new Storage(LocalStorage);
  }

  storeProduct(product){
    this.local.get('cart').then((data)=>{
      console.log("Data : "+data)
      if(data!=null){this.temp=JSON.parse(data)}

      var isAlreadyAdded:boolean = false;
      for(let pr of this.temp){
          if(pr.id==product.id){
            isAlreadyAdded=true;
            pr.qty+=1;
          }
      }
      
      if(isAlreadyAdded==false){
        console.log("not already added")
        this.temp.push({product_id:product.id,product_name:product.name,product_img:product.photo,product_price:product.price,product_qty:1})

      }

      isAlreadyAdded=false
      console.log(this.temp);
      this.local.set('cart',JSON.stringify(this.temp));
    })
  }

  clearCart(){
    this.temp=[];
  }

  delete(id){
    return new Promise(resolve=>{
      this.local.get('cart').then((data)=>{
        this.temp = JSON.parse(data)
        console.log("before delete: "+this.temp)
        console.log(this.temp)
        for(let pr of this.temp){
            console.log("loop :"+pr.product_id)
            if(pr.product_id==id){
              console.log("id "+id)
              var index = this.temp.indexOf(id);
              this.temp.splice(index,1);
            }
        }
        console.log("after delete: "+this.temp)      
        this.local.set('cart',JSON.stringify(this.temp))
        resolve(true)
      })
    })
  }


  loadWebsite(){
    return new Promise(resolve=>{
      this.http.get('http://'+Vars.URL+'/public/'+Vars.SUBDOMAIN+'/website')
        .map(res=>res.json())
        .subscribe(data=>{
          console.log("Data.ts : website konek");
          this.data=data;
          resolve(this.data);
        },
        error=>{
          console.log("website ra konek");
        })
    })
  }

  //Observable coba
  loadProd(page:number, sort="latest", categoryId, search){
    if (categoryId==undefined){
      categoryId="all"
    }
    if (search==undefined||search==""){
      search="none"
    }
    console.log("Data.ts page : "+page+" sort: "+sort+" categoryId: "+categoryId+" search: "+search);
    return this.http.get('http://'+Vars.URL+'/public/'+Vars.SUBDOMAIN+'/product?page='+page+'&sorting='+sort+'&categories='+categoryId+'&search_name='+search)
        .map(res=>res.json());
        
  }

  //Promis
  loadProducts(page:number, sort="latest", categoryId, search){
    if (categoryId===undefined){
      categoryId="all"
    }
    if (search===undefined){
      search="all"
    }
    console.log("Data.ts page : "+page+" sort: "+sort+" categoryId: "+categoryId+" search: "+search);
    return new Promise(resolve=>{
      this.http.get('http://'+Vars.URL+'/public/'+Vars.SUBDOMAIN+'/product?page='+page+'&sorting='+sort+'&categories='+categoryId+'&search_name='+search)
        .map(res=>res.json())
        .subscribe(data=>{
          console.log("Data.ts : konek");
          this.data=data;
          resolve(this.data);
        },
        error=>{
          console.log("ra konek");
        })
    })
  }

  loadCategories(){
    return new Promise(resolve=>{
      this.http.get('http://'+Vars.URL+'/public/'+Vars.SUBDOMAIN+'/categories')
        .map(res=>res.json())
        .subscribe(data=>{
          console.log("Data.ts : categories konek");
          this.data=data;
          resolve(this.data);
        },
        error=>{
          console.log("Data.ts : categories ra konek");
        })
    })
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('path/to/data.json')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}

