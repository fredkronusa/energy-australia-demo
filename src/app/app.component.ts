import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import sortBy from 'sort-by';
import * as COMMON from '../assets/static/content/common';

interface ICarShow {
  name: string;
  cars: ICar[];
}

interface ICar {
  name: string;
  model: string;
}

interface IError {
  message: string;
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  results: Observable<ICarShow[]>;
  errorMessage: Observable<IError>;

  constructor(public http: HttpClient) {
    this.results = this.getCars();
    this.errorMessage = null;
  }

  getCars(): Observable<ICarShow[]> {
    return this.http.get<ICarShow[]>(COMMON.API_URL)
      .pipe(
        map(res => this.transform(res)),
        catchError(this.handleError.bind(this))
      );
  }

  transform (response) {

    if (response === '') {
      this.setMessage(null, COMMON.WARNING, COMMON.NO_DATA);
    }
    const list = [];
    for (const show of response) {
      const showName = show.name || COMMON.NO_SHOW;
      for (const car of show.cars) {
        const carMake = car.make || COMMON.NO_MAKE;
        const carModel = car.model || COMMON.NO_MODEL;
        let make = list.find((make) => make.make === carMake);
        if (!make) {
          make = {
            make: carMake,
            models: [],
          };
          list.push(make);
        }
        let model = make.models.find((model) => model.name === carModel);
        if (!model) {
          model = {
            name: carModel,
            shows: [],
          };
          make.models.push(model);
        }
        const shows: any = [];
        if (!model.shows.includes(showName)) {
          model.shows.push(showName);
        }
      }
    }

    return list.sort(sortBy('make'));
  }

  // convert into a high order component
  setMessage(error: HttpErrorResponse, messageType: string, customMessage?: string): IError {
     return this.errorMessage = customMessage ?  customMessage : error.error;
  }

  handleError(error: HttpErrorResponse) {
    this.setMessage(error, COMMON.ERROR);
    return throwError(error);
  }
}
