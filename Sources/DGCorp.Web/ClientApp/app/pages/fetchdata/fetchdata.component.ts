import {Component, Inject} from '@angular/core';
import {CoreConfiguration} from '../../core/core.configuration';
import {ApiService} from '../../core/services/http/api-service';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html'
})
export class FetchDataComponent {
    public forecasts: WeatherForecast[];

    constructor(private api: ApiService, private configuration: CoreConfiguration) {
        api.get<any>(configuration.getActionUri('sampleData', 'weatherForecasts'))
            .subscribe(result => {
                this.forecasts = result as WeatherForecast[];
            }, error => console.error(error));
    }
}

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
