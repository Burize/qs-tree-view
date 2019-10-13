export interface ICommunication<E = string> {
  isRequesting: boolean;
  error: E | null;
}

export const initialCommunication: ICommunication = { isRequesting: false, error: null };

export const pendingCommunication: ICommunication = { isRequesting: true, error: null };

export function makeFailCommunication<E = string>(error: E): ICommunication<E> {
  return { isRequesting: false, error };
}

export function isSuccessCommunication(prev: ICommunication, next: ICommunication): boolean {
  return prev.isRequesting && !next.isRequesting && next.error === null;
}

export function isFailedCommunication(prev: ICommunication, next: ICommunication): boolean {
  return prev.isRequesting && !next.isRequesting && next.error !== null;
}
