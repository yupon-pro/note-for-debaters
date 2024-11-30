"use server";

import { deleteUser, patchUser } from "@/libs/auth";
import { AccountScheme } from "../schemes/accountSchemes";
import { EditAccountState } from "../types/accountFormTypes";

export async function editAccountFormAction(prevState: EditAccountState, formData: FormData): Promise<EditAccountState>{
  const safeFields = AccountScheme.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if(!safeFields.success){
    const errors = {
      status: "Failure",
      errors: safeFields.error.flatten().fieldErrors,
      message: "Missing Fields"
    } as const;
    return errors;
  }

  const { name, password } = safeFields.data;

  try{
    await patchUser(name, password);
    return { status: "Success" }
  }catch(error){
    const errors = {
      status: "Failure",
      message: error instanceof Error ? error.message  :  "Failed to edit account."  
    } as const;
    return errors;
  }
}

export async function deleteAccountAction() {
  await deleteUser();
}