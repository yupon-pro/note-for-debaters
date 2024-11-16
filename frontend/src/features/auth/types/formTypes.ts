type FieldStatus = "Success" | "Failure" | "Initial";

export type SignInState = {
  errors?: {
    email?: string[];
    password?: string[]
  };
  message?: string | null;
};

export type SignUpState = {
  status: FieldStatus;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

export type MailCodeState = {
  status: FieldStatus;
  errors?: {
    code?: string[];
  };
  message?: string | null;
};

export type MailInputState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
}

export type ResetPwdState = {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
}