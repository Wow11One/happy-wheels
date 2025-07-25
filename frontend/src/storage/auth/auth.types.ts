import { ActorSubclass, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from '../../../../src/declarations/backend/backend.did';

export interface AuthenticatedUser {
  authClient: AuthClient;
  identity: Identity;
  principal: Principal;
  actor: ActorSubclass<_SERVICE>;
  isAuthenticated: true;
}

export interface NotAuthenticatedUser {
  isAuthenticated: false;
}

export type AuthUser = AuthenticatedUser | NotAuthenticatedUser;
