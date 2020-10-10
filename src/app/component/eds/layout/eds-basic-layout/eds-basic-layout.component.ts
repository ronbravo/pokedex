import { Component, OnInit } from '@angular/core';
import { HostAppService } from 'src/app/service/host-app.service';

@Component({
  selector: 'eds-basic-layout',
  templateUrl: './eds-basic-layout.component.html',
  styleUrls: ['./eds-basic-layout.component.less'],
  host: { 'class': 'eds-basic-layout layout' }
})
export class EdsBasicLayoutComponent implements OnInit {

  menus = [
    { icon: 'home', label: 'Home', url: '/' },
    { icon: 'pets', label: 'Pokemon', url: '/vue' },
    // { icon: 'list', label: 'Catalog', url: '/' },
    // { icon: 'location_on', label: 'Regions', url: '/' },
    // { icon: 'group_work', label: 'Abilities', url: '/' },
    // { icon: 'shopping_bag', label: 'Items', url: '/' },
  ];

  constructor(private hostAppService: HostAppService) {
    // this.hostAppService.
  }

  ngOnInit() {
  }

}
