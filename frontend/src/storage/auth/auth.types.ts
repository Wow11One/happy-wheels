import { ActorSubclass, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import {
  _SERVICE,
  Tire,
  Transaction,
  User,
} from '../../../../src/declarations/backend/backend.did';

export interface RegisteredUser {
  userId: string;
  authClient: AuthClient;
  identity: Identity;
  principal: Principal;
  actor: ActorSubclass<_SERVICE>;
  isAuthenticated: true;
}

export interface AuthenticatedUser {
  userId: string;
  authClient: AuthClient;
  identity: Identity;
  principal: Principal;
  actor: ActorSubclass<_SERVICE>;
  profile: User;
  transactions: Transaction[];
  tires: Tire[];
  isAuthenticated: true;
}

export interface NotAuthenticatedUser {
  isAuthenticated: false;
}

export type AuthUser = AuthenticatedUser | NotAuthenticatedUser | RegisteredUser;

export interface LoginResponse {
  isUserFirstLoggedIn: boolean;
}

export interface AuthStorageErrors {
  fetchAuthUser: string | null;
  login: string | null;
  logout: string | null;
}
