import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  host: { class: 'host-ui-sidebar' },
})
export class SidebarComponent implements OnInit {
  @Input() menus = [];

  constructor() { }

  ngOnInit() {
  }

}
