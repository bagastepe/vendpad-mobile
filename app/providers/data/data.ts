import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
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
  inv=[]
  constructor(private http: Http) {
    this.data = null;
    this.local = new Storage(LocalStorage);
  }

  storeProduct(product){
    return new Promise(resolve=>{
      this.local.get('cart').then((data)=>{
      console.log("Data : "+data)
      if(data!=null){this.temp=JSON.parse(data)}
      else{this.temp=[]}

      console.log(this.temp)

      var isAlreadyAdded:boolean = false;
      for(let pr of this.temp){
          console.log(pr.product_id+ " :: "+product.id)
          if(pr.product_id==product.id){
            isAlreadyAdded=true;
            pr.product_qty+=1;
          }
      }
      
      if(isAlreadyAdded==false){
        console.log("not already added")
        this.temp.push({product_id:product.id,product_name:product.name,product_img:product.photo,product_price:product.price,product_qty:1})

      }

      isAlreadyAdded=false
      console.log(this.temp);
      this.local.set('cart',JSON.stringify(this.temp));
      resolve(true)
    })
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

  //Load Products
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
  // loadProducts(page:number, sort="latest", categoryId, search){
  //   if (categoryId===undefined){
  //     categoryId="all"
  //   }
  //   if (search===undefined){
  //     search="all"
  //   }
  //   console.log("Data.ts page : "+page+" sort: "+sort+" categoryId: "+categoryId+" search: "+search);
  //   return new Promise(resolve=>{
  //     this.http.get('http://'+Vars.URL+'/public/'+Vars.SUBDOMAIN+'/product?page='+page+'&sorting='+sort+'&categories='+categoryId+'&search_name='+search)
  //       .map(res=>res.json())
  //       .subscribe(data=>{
  //         console.log("Data.ts : konek");
  //         this.data=data;
  //         resolve(this.data);
  //       },
  //       error=>{
  //         console.log("ra konek");
  //       })
  //   })
  // }

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

  webOrder(detail){
    var url = 'http://'+Vars.URL+'/public/'+Vars.SUBDOMAIN+'/web_order_mobile'
    var params = 'order_json='+detail.order_json+'&customer_email='+detail.customer_email+'&customer_name='+detail.customer_name+'&customer_phone='+detail.customer_phone+'&customer_line='+detail.customer_line+'&customer_wa='+detail.customer_wa+'&delivery_address='+detail.delivery_address+'&delivery_from_name='+detail.delivery_from_name+'&delivery_phone='+detail.delivery_phone+'&sale_keterangan='+detail.sale_keterangan;
    console.log(params)
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // headers.append('Access-Control-Allow-Origin', '*');
    return new Promise(resolve=>{
      this.http.post(url,params,{headers:headers})
      .map(res=>res.json())
      .subscribe(data=>{
        console.log("success")
        this.data=data
        console.log(this.data)
        resolve(this.data)
      },
      error=>{
        var err = "error"
        resolve(err)
        console.log("cant connect :"+error)
        console.log(detail)
      })
    })
  }

  getToken() {
    
    let token = document.querySelector('meta[name="_token"]')['content'];
    return token;
  }


  storeInvoice(detail){
    this.local.get('invoice').then((data)=>{
      var x = data
      console.log("Data: "+x)
      if (data!==null){
        console.log('not null')
         this.inv=JSON.parse(data)
      }
      else{     
        this.inv=[]
      }
      console.log(detail)
      console.log(this.inv)
      this.inv.splice(0,0,detail);
      console.log(this.inv)
      this.local.set('invoice',JSON.stringify(this.inv)) 
    })
  }
}

