"use client";

import { Button } from "@/components/ui/button";
import { consentStatusAtom, mailCodeStatusAtom, signUpFormStatusAtom, stepErrorAtom } from "@/jotai/SignUpStepAtom";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { useAtom, } from "jotai";
import { useEffect, useState } from "react";
import { Step, Stepper } from "react-form-stepper";
import SignUpForm from "./SignUpForm";
import MailAuthCode from "./MailAuthCode";
import SignUpComplete from "./SignUpComplete";
import { useRouter } from "next/navigation";
import ConsentForm from "./ConsentForm";

const steps = [{label: "Form"}, {label: "Mail Code"}, {label: "complete"}];

export default function SignUpSteps() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0);
  const [consentStatus, setConcentStatus] = useAtom(consentStatusAtom)
  const [signUpFromStatus, setSignUpFormStatus] = useAtom(signUpFormStatusAtom);
  const [mailCodeStatus, setMailCodeStatus] = useAtom(mailCodeStatusAtom);
  const [stepError, setStepError] = useAtom(stepErrorAtom);

  useEffect(() => {
    if(signUpFromStatus === "Success"){
      setActiveStep(2);
    }
    if(mailCodeStatus=== "Success"){
      setActiveStep(3);
    }

  }, [signUpFromStatus, mailCodeStatus]);


  function handleNext() {
    if(stepError) return false;
    if(activeStep === 0 && !consentStatus) return false;
    if(activeStep === 1 && signUpFromStatus !== "Success") return false;
    if(activeStep === 2 &&  mailCodeStatus !== "Success") return false;

    setActiveStep((prev) => prev + 1);
  };

  function handleBack() {
    if(stepError) setStepError(false);
    if(activeStep === 1) setConcentStatus(false);
    if(activeStep === 2) setSignUpFormStatus("Initial");
    if(activeStep === 3) setMailCodeStatus("Initial");
    
    setActiveStep((prev) => prev - 1);
  };

  return (
    <VStack width="full">
      <Stepper activeStep={activeStep}>
        <Step 
          label="form" 
          style={{ 
            backgroundColor: `${ 
              signUpFromStatus === "Failure"  
                ? "red"
                : activeStep === 1
                ? "cyan"
                : "lightcyan" 
            }` 
          }}  
        />
        <Step 
          label="code" 
          style={{ 
            backgroundColor: `${ 
              mailCodeStatus === "Failure"  
                ? "red"
                : activeStep === 2
                ? "cyan"
                : "lightcyan" 
            }` 
          }}  
        />
        <Step 
          label="complete" 
          style={{ 
            backgroundColor: `${ 
              activeStep === 3
                ? "cyan"
                : "lightcyan" 
            }` 
          }}  
        />
      </Stepper>
      <StepContent activeStep={activeStep} />
      <HStack w="full" justifyContent="space-around" >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        { activeStep === steps.length ? (
          <Button onClick={() => router.push("/mypage")} >
            My Page
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={stepError} >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

function StepContent({ activeStep }: { activeStep: number }){
  return(
    <Box minH="50vh">
      {
        activeStep === 0
          ? <ConsentForm />
          : activeStep === 1 
          ? <SignUpForm /> 
          : activeStep === 2 
          ? <MailAuthCode />
          : <SignUpComplete />
      }
    </Box>
  );
}