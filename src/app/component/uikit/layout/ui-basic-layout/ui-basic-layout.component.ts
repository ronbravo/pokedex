import { Component, OnInit } from '@angular/core';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// loads the Icon plugin
UIkit.use(Icons);

@Component({
  selector: 'ui-basic-layout',
  templateUrl: './ui-basic-layout.component.html',
  styleUrls: ['./ui-basic-layout.component.less'],
  host: { 'class': 'ui-basic-layout layout' }
})
export class UiBasicLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
