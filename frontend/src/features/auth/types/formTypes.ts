type FormStatus = "Success" | "Failure" | "Initial";

export type SignInState = {
  errors?: {
    email?: string[];
    password?: string[]
  };
  message?: string | null;
};

export type SignUpState = {
  status: FormStatus;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};