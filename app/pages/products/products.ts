import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ProductDetailsPage} from '../product-details/product-details';
import {CartPage} from '../cart/cart';
import {Data} from '../../providers/data/data';

/*
  Generated class for the ProductsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/products/products.html',
})
export class ProductsPage {
  myInput;
  categories;
  category;
  products =[];
  sort:any;
  start:number=1;
  canLoad:boolean=true;
  searchVisible:boolean=false;
  search='none'
  prod;
  constructor(private nav: NavController,private data:Data) {
        this.category="all"
        this.sort="latest"
  }

  ionViewLoaded(){
    this.data.loadCategories().then(data=>{
      this.categories = data;
      this.categories = this.categories.aaData;
    })
    
    this.getProducts(this.start,this.sort,"all","none")

  }

  getProducts(page:number,sorting,cat,search,fromInfinite=true){
    return new Promise(resolve=>{
      this.data.loadProd(page,sorting,cat,search).subscribe(data=>{
        if(!fromInfinite){
          this.products = [];
        }
        this.prod = data
        console.log('jumlah : '+this.prod.aaData.length)      
        if(this.prod.aaData.length>0){
          this.start++;
          for(let pr of this.prod.aaData){
            this.products.push(pr);
          }
          this.prod.aaData.length<16? this.canLoad=false : this.canLoad=true;
        }
        else{
          this.canLoad=false
        }
        console.log(this.products)
        resolve(true);
     
      },
      error=>{

      })
    })    
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation '+(this.start)+' '+(this.category));
    
    this.getProducts(this.start,this.sort,this.category,this.search).then(
      ()=>{
        console.log(this.start);
        console.log('Async operation has ended');
        infiniteScroll.complete();
      }
    );
  }

  gotoDetail(p){
    this.nav.push(ProductDetailsPage,{
      details:p
    })
  }

  gotoCart(){
    this.nav.push(CartPage);
  }

  toggleSearch(e){
    if(this.searchVisible){
      this.searchVisible=false;
    }
    else{
      this.searchVisible=true;
    }
  }


  //sorting produk
  sortProduct(e){
    this.canLoad=true
    console.log(this.sort);

    this.start=1
    this.products=[]
    this.getProducts(this.start,this.sort,this.category,this.myInput,false)
  }

  //ganti kategori produk
  categoryProduct(e){
    this.canLoad=true
    console.log(this.category);
    if(this.category!=undefined){
      this.start=1
      this.products=[]
      this.getProducts(this.start,this.sort,this.category,this.myInput,false)
    }
  }

  //searching
  onInputSearch(ev){
    let val = ev.target.value;
    this.products=[];
    this.canLoad=true
    this.start=1
    this.search=val

    this.getProducts(this.start,this.sort,this.category,val,false).then(

      ()=>{
        
        console.log('search done')}
    );
    
    // this.data.loadProd(this.start,this.sort,this.category,this.myInput)
  }
  //hapus search
  onCancelSearch(){
    this.myInput=""
    this.getProducts(this.start,this.sort,this.category,this.myInput);
  }

}

