import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-pokemon',
  templateUrl: './show-pokemon.component.html',
  styleUrls: ['./show-pokemon.component.css']
})
export class ShowPokemonComponent implements OnInit {

  constructor() {
    fetch('https://pokeapi.co/api/v2/pokemon/4')
      .then(res => res.json())
      .then((data) => {
        this.data = data;
        console.log('DATA:', data);
      })
  }

  ngOnInit() {
  }

}
