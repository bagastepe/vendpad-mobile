import { Component } from '@angular/core';
import { NavController,Platform,Storage,LocalStorage } from 'ionic-angular';
import {ProductDetailsPage} from '../product-details/product-details';
import {InAppBrowser} from 'ionic-native';
import {CartPage} from '../cart/cart';
import {Data} from '../../providers/data/data';
import {Vars} from '../../vars'

/*
  Generated class for the ProductsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/products/products.html',
})
export class ProductsPage {
  variasi
  toko=Vars.SUBDOMAIN
  coba=""
  myInput;
  categories;
  category;
  products =[];
  sort:any;
  start:number=1;
  canLoad:boolean=true;
  searchVisible:boolean=false;
  search='none'
  konek:boolean
  prod;
  totalCart=0;
  local;
  constructor(private nav: NavController,private data:Data,private platform:Platform) {
        this.category="all"
        this.sort="latest"
        this.konek=true
        this.local=new Storage(LocalStorage)
  }

  onPageWillEnter(){
    this.searchVisible=false
    this.updateCartLabel()
    
  }

  ionViewLoaded(){
    
    this.data.loadCategories().then(data=>{
      this.categories = data;
      this.categories = this.categories.aaData;
    },
    error=>{
      this.konek=false
    })
    
    this.getProducts(this.start,this.sort,"all","none").then(()=>{
      
    })

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
      
        for(let p of this.products){
          p.variasi={id:p.id,name:p.varian[0].value,photo:p.photo,price:p.price}
          // p.variasi = p
          // p.variasi.id=p.id
        }
        resolve(true);
     
      },
      error=>{
        this.konek=false
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

  gotoDetail(e,p){
    if(e.target.classList[0]!="select-varian"){
    this.nav.push(ProductDetailsPage,{
      details:p
    })
    }
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
  test(p,e){
    console.log(p.id)
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
        
        console.log('search done:'+this.products.length)}
    );
    
    // this.data.loadProd(this.start,this.sort,this.category,this.myInput)
  }
  //hapus search
  // onCancelSearch(e){
  //   this.myInput=""
  //   console.log('asdadad')
  //   this.searchVisible=false
  //   // this.getProducts(this.start,this.sort,this.category,this.myInput);
  // }

  //reconnect
  reconnect(){
    this.canLoad=true
    this.konek=true
    this.products=[]
    this.data.loadCategories().then(data=>{
      this.categories = data;
      this.categories = this.categories.aaData;
    },
    error=>{
      this.konek=false
    })
    this.start=1
    this.getProducts(this.start,this.sort,"all","none",false)
  }

  updateCartLabel(){
    this.local.get('cart').then(data=>{
          if(data!=null){this.totalCart=JSON.parse(data).length}
          else{this.totalCart=0}
        })
  }


}

