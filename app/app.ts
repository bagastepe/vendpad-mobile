import { HTTP_PROVIDERS } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar, ScreenOrientation,Splashscreen } from 'ionic-native';
import { Data } from './providers/data/data';
import { LocaleService, LocalizationService } from 'angular2localization/angular2localization';
import { ProductsPage } from './pages/products/products';
import { InvoicePage } from './pages/invoice/invoice';
import { CustomPage } from './pages/custom/custom';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProductsPage;
  pagesOri
  pages: Array<{title: string, component: any, parameter:any}>;

  constructor(public platform: Platform, private data:Data,public locale: LocaleService, public localization: LocalizationService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Products', component: ProductsPage, parameter:null },
      { title: 'Invoice', component: InvoicePage, parameter:null }
      
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
      Splashscreen.hide();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // StatusBar.overlaysWebView(true); // let status var overlay webview

      // StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white
      // ScreenOrientation.lockOrientation("portrait");
      // Adds a new language (ISO 639 two-letter or three-letter code).
            this.locale.addLanguage('id');
            // Add a new language here.

            this.locale.useLocalStorage(); // To store the user's chosen language, prefer Local Storage.

            // Required: default language.
            // Selects the current language of the browser/user if it has been added, else the default language.
            this.locale.definePreferredLanguage('id');

            // Initializes LocalizationService: asynchronous loading.
            this.localization.translationProvider('./i18n/locale-'); // Required: initializes the translation provider with the given path prefix.      
            this.localization.updateTranslation(); // Need to update the translation.
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

ionicBootstrap(MyApp,[Data,LocaleService, LocalizationService,HTTP_PROVIDERS]);
