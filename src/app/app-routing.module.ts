import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './user/components/sign-in/sign-in.component';
import {HomeComponent} from './components/home/home.component';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {SignUpComponent} from './user/components/sign-up/sign-up.component';
import {UserInfoComponent} from './user/components/user-info/user-info.component';
import {UsersManagementComponent} from './user/components/users-management/users-management.component';
import {ItemsManagementComponent} from './items/components/items-management/items-management.component';
import {BarterOfferComponent} from './barter/components/barter-offer/barter-offer.component';
import {BarterOfferResolver} from './barter/barter-offer.resolver';
import {UserTransactionsComponent} from './barter/components/user-transactions/user-transactions.component';
import {UserTransactionsResolver} from './barter/user-transactions.resolver';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'users-management',
    component: UsersManagementComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  // {
  //   path: 'transactions-management',
  //   component: TransactionsManagementComponent,
  //   canActivate: [AngularFireAuthGuard],
  //   data: {authGuardPipe: redirectUnauthorizedToLogin}
  // },
  {
    path: 'items-management',
    component: ItemsManagementComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'barter-offer/:id',
    component: BarterOfferComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    resolve: {
      data: BarterOfferResolver
    }
  },
  {
    path: 'user-transactions',
    component: UserTransactionsComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    resolve: {
      data: UserTransactionsResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
