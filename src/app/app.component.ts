import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, filter, tap, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {catchError} from 'rxjs/operators';
import sortBy from 'sort-by';

const API_URL = '/api/v1/cars';

interface ICarShow {
  name: string
  cars: ICar[]
}

interface ICar {
  name: string
  model: string
}

interface IError {
  error: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  results: Observable<ICarShow[]>;
  errorMessage: Observable<IError>;

  constructor(private http: HttpClient) { 
    this.results = this.getCars();
  }

  getCars() {

    const response: ICarShow[] = require('../../mocks/complete-list-sample.json');
    return of (this.transform(response))
    //return of(shows);

    // return this.http.get<ICarShow[]>('/api/v1/cars')
    //   .pipe(
    //     catchError(this.handleError),
    //     map(res => res)
    //   );
  }

  transform (input) {
    const makes = [];
    for (const show of input) {
      const showName = show.name || 'Unknown show name';
      for (const car of show.cars) {
        const carMake = car.make || 'Unknown car make';
        const carModel = car.model || 'Unknown model name';
        let make = makes.find((make) => make.make === carMake);
        if (!make) {
          make = {
            make: carMake,
            models: [],
          };
          makes.push(make);
        }
        let model = make.models.find((model) => model.name === carModel);
        if (!model) {
          model = {
            name: carModel,
            shows: [],
          };
          make.models.push(model);
        }
        if (!model.shows.includes(showName)) {
          model.shows.push(showName);
        }
      }
    }

    return makes.sort(sortBy('make'));
  }


  handleError(error: HttpErrorResponse) {

    this.errorMessage = error.error;
    const errorMsg = `Backend returned code ${error.status}, body was: ${error.error}`;
    return throwError(errorMsg);
  }
   
}



















