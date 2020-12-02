import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {
  data = [];

  constructor(
    private router: Router,
  ) {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0')
      .then(res => res.json())
      .then((data) => {
        this.data = data;
        console.log('DATA:', data);
      })
  }

  ngOnInit() {
  }

  viewDetails(item: any) {
    const id = 4;
    this.router.navigate(['/pokemon', 'details']);
    // console.log(item);
  }

}
