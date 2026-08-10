import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgHttpLoaderComponent } from 'ng-http-loader';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgHttpLoaderComponent, NgProgressbar, NgProgressRouter, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
