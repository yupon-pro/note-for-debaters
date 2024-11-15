import { Button } from "@/components/ui/button";
import { signUpFormStatusAtom, stepError } from "@/jotai/SignUpStepAtom";
import { HStack, VStack } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Stepper, } from "react-form-stepper";

const steps = [{label: "Form"}, {label: "Mail Code"}, {label: "complete"}];

export default function SignUpSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const signUpFromStatusValue = useAtomValue(signUpFormStatusAtom);
  const [stepErrorValue, setStepError] = useAtom(stepError);

  useEffect(() => {
    if(signUpFromStatusValue === "Success"){
      setActiveStep(1);
    }

  }, [signUpFromStatusValue]);

  function handleNext() {
    if(stepErrorValue || signUpFromStatusValue !== "Success"){
      return false;
    }
    setActiveStep((prev) => prev + 1);
  };

  function handleBack() {
    if(stepErrorValue){
      setStepError(false);
    }
    setActiveStep((prev) => prev - 1);
  };


  return (
    <VStack width="full">
      <Stepper 
        activeStep={activeStep} 
        steps={steps}
        color={stepErrorValue ? "red" : "blue"}
      />
      <StepContent activeStep={activeStep} />
      <HStack w="full" justifyContent="space-between" alignItems="center" >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </HStack>
    </VStack>
  );
}

function StepContent({ activeStep }: { activeStep: number }){
  switch(activeStep){
    case 0:
      return <></>;
    case 1:
      return <></>;
    case 2:
      return <></>;
    default:
      return null;
  }
}