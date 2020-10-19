import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// loads the Icon plugin
UIkit.use(Icons);

// components can be called from the imported UIkit reference
// UIkit.notification('Hello world.');

interface Ability {
  name: string;
  url: string;
}

interface Move {
  name: string;
  url: string;
}

interface Sprites {
  back_default: string;
  front_default: string;
}

interface Pokemon {
  abilities: Ability[];
  base_experience: number;
  height: number;
  id: number;
  sprites: Sprites;
  is_default: boolean;
  location_area_encounters: string;
  moves: Move[];
  name: string;
  order: number;
  weight: number;
}

@Component({
  selector: 'app-pkd-pokemon-inspector-ang8',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  title = 'Pokedex: Pokemon Inspector Angular 8';
  pokedex: Pokemon[] = [];
  selectedPokemon: Pokemon;
  apiURL = 'https://pokeapi.co/api/v2/pokemon';
  showDetails = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    for (let i = 0; i < 200; i++) {
      this.getPokemonData(i + 1).subscribe(res => {
        this.pokedex[i] = {
          abilities: res.abilities,
          base_experience: res.base_experience,
          height: res.height,
          id: res.id,
          sprites: res.sprites,
          is_default: res.is_default,
          location_area_encounters: res.location_area_encounters,
          moves: res.moves,
          name: res.name.charAt(0).toUpperCase() + res.name.slice(1),
          order: res.order,
          weight: res.weight,
        };
      });
    }
    console.log(this.pokedex);
  }

  /**
   * @desc    Get Pokemon Data
   * @returns Observable
   */
  getPokemonData(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiURL}/${id}`);
  }

  showMoreDetails(id: number) {
    this.showDetails = true;

    this.getPokemonData(id).subscribe(res => {
      this.selectedPokemon = {
        abilities: res.abilities,
        base_experience: res.base_experience,
        height: res.height,
        id: res.id,
        sprites: res.sprites,
        is_default: res.is_default,
        location_area_encounters: res.location_area_encounters,
        moves: res.moves,
        name: res.name.charAt(0).toUpperCase() + res.name.slice(1),
        order: res.order,
        weight: res.weight,
      };
    });
  }

  showLessDetails() {
    this.showDetails = false;
  }
}
