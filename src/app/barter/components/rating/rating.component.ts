import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  rating: number = 1;
  @Output() ratingChange = new EventEmitter<number>();
  @Input() isDisabled: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  rate(ratingNumber: number): void {
    this.rating = ratingNumber;
    this.ratingChange.emit(this.rating);
  }
}
