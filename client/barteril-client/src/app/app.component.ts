import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'barteril-client';
  isSignInPage: boolean;

  constructor(private router: Router) {
  }


  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isSignInPage = (['/sign-in', '/sign-up'].includes(val.url));
      }
    });
  }
}
