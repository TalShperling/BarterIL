import {Component, OnInit} from '@angular/core';
import {MDBModalRef} from 'angular-bootstrap-md';
import {User} from '../../../../entities/user.model';
import {RatingService} from '../../services/rating.service';
import {AlertsService} from '../../../services/alerts/alerts.service';

@Component({
  selector: 'app-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.scss']
})
export class UserRatingComponent implements OnInit {
  ratedUser: User;
  ratingUser: string;
  rating: number = 1;

  constructor(public modalRef: MDBModalRef,
              private ratingService: RatingService,
              private alertsService: AlertsService) {
  }

  ngOnInit(): void {
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  rate(): void {
    this.ratingService.upsert$({
      id: '',
      rating: this.rating,
      ratingUser: this.ratingUser,
      ratedUser: this.ratedUser.id
    }).subscribe(() => {
      this.modalRef.hide();
      this.alertsService.showSuccessAlert('User was rated!');
    });
  }

}
