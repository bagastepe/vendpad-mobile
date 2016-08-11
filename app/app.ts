import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar, ScreenOrientation } from 'ionic-native';
import { Data } from './providers/data/data';

import { Page1 } from './pages/page1/page1';
import { ProductsPage } from './pages/products/products';
import { CustomPage } from './pages/custom/custom';
import { Page2 } from './pages/page2/page2';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProductsPage;
  pagesOri
  pages: Array<{title: string, component: any, parameter:any}>;

  constructor(public platform: Platform, private data:Data) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Products', component: ProductsPage, parameter:null }
    ];

    this.data.loadWebsite().then(data=>{
      this.pagesOri=data;
      console.log(this.pagesOri.data)
      for(let p of this.pagesOri.data.pages){
        this.pages.push({title:p.page_title,component:CustomPage,parameter:{title:p.page_title,body:p.page_body}})
      }
    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.overlaysWebView(true); // let status var overlay webview

      StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white
      // ScreenOrientation.lockOrientation("landscape");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{
      parameter:page.parameter
    });
  }
}

ionicBootstrap(MyApp,[Data]);
