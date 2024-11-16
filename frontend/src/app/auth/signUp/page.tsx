import dynamic from "next/dynamic";

// https://snyk.io/advisor/npm-package/react-form-stepper
const StepperComponent = dynamic(() => import("@/features/auth/singUp/components/SignUpSteps"), {
  ssr: false,
});

export default function Page(){
  return(
    <StepperComponent />
  );
}