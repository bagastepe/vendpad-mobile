import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the CustomPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/custom/custom.html',
})
export class CustomPage {
  pageBody:any
  constructor(private nav: NavController, private navParams: NavParams) {
    this.pageBody=this.navParams.get('parameter')
  }


}
