export type EditAccountState = {
  status?: "Pending" | "Success" | "Failure"
  errors?: {
    name?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};