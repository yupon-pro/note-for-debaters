"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton(){
  const { pending } = useFormStatus();
  return(
    <Button type="submit" loading={pending} loadingText="submitting" >
      submit
    </Button>
  );
}