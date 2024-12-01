import dynamic from "next/dynamic";

// [Notion]
// Why should I use dynamic import like this?
// Refer to https://snyk.io/advisor/npm-package/react-form-stepper
const StepperComponent = dynamic(() => import("@/features/auth/singUp/SignUpSteps"), {
  ssr: false,
});

export default function Page(){
  return(
    <StepperComponent />
  );
}