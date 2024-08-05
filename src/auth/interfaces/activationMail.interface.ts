export interface IActivationToken {
  activationtoken: string;
  activationcode: string;
}

export interface EmailVerificationTokenPayload {
  userId: number;
  email: string;
  activationcode: string;
}
