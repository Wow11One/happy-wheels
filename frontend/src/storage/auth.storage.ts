import { Identity } from "@dfinity/agent";
import { atom } from "jotai";

export const internetIdentityAtom = atom<Identity | null>(null);
export const solanaIdentityAtom = atom<Identity | null>(null);
export const isAuthenticatedAtom = atom<Identity | null>(null);