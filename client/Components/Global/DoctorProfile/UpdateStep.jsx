import React, { useEffect, useState } from 'react'
import Stepper from "@keyvaluesystems/react-stepper";
import UpdateTest from './UpdateTest';
import { useStateContext } from '../../../Context';
import UpdateStatus from './UpdateStatus';
import Update from './Update';

export default function UpdateStep({
  patientID,
  appointmentID
}) {
  const { 
    ADD_MEDICAL, 
    ADD_TEST, 
    GET_ALL_MEDICINE, 
    ADD_PRESCRIPTION,
    COMPLETE_APPOINTMENT
  } = useStateContext()
  const [currentStep, setCurrentStep] = useState(0);
  const [registerMedicine, setRegisterMedicine] = useState();
  
console.log(appointmentID)
  const [prescriptionUpdate, setPrescriptionUpdate] = useState({
    patientID: patientID.toString(),
    medications: []
  })

  const [conditionUpdate, setConditionUpdate] = useState({
    patientID: patientID.toString(),
    symptoms: "",
    diagnosis: "",
    tests: [],
    prescriptions: [],
  });

  const [testUpdate, setTestUpdate] = useState({
    patientID: patientID.toString(),
    typeOfTest: "",
    result: "",
    diagnosis: "",
    notes: "",
    images: [],
  });

  const steps = [
    {
      stepLabel: "Update Test",
      completed: currentStep > 0,
    },
    {
      stepLabel: "Update Diagnosis",
      completed: currentStep > 1,
    },
    {
      stepLabel: "Update Prescription",
      completed: currentStep > 2,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep+1);
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <UpdateTest 
            setTestUpdate={setTestUpdate}
            testUpdate={testUpdate}
            handleClick={() => handleAddTest(testUpdate)}
          />
        );
      case 1:
        return (
          <UpdateStatus 
            setConditionUpdate={setConditionUpdate}
            conditionUpdate={conditionUpdate}
          />
        );
      case 2:
        return (
          <Update 
            setPrescriptionUpdate={setPrescriptionUpdate}
            registerMedicine={registerMedicine}
            handleClick={() => handleAddPrescription(prescriptionUpdate)}
          />
        );
      default:
        return null;
    }
  };

  const handleAddTest = async (data) => {
    console.log(data);
    const testID = await ADD_TEST(data);
    setConditionUpdate(prev => ({
      ...prev,
      tests: [...prev.tests, testID]
    }));
  };

  const handleAddPrescription = async (data) => {
    console.log(data);
    const prescriptionID = await ADD_PRESCRIPTION(data);
    setConditionUpdate(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, prescriptionID]
    }));
  };

  const handleComplete = async (data) => {
    const hash = await ADD_MEDICAL(data);

    if (hash) {
      await COMPLETE_APPOINTMENT(appointmentID);
    }
  }

console.log(conditionUpdate)
  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_MEDICINE().then((medicine) => {
        setRegisterMedicine(medicine);
      });
    };

    fetchData();
  }, []);

  return (
    <div
      className='modal fade'
      id='exampleModal'
      tabIndex={-1}
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Add Doctor</h5>
            <button 
              className='btn-close'
              type='button'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <Stepper
              orientation={'horizontal'}
              steps={steps}
              currentStepIndex={currentStep}
            />
            <div className="my-4">{renderStepContent()}</div>
            <div className="d-flex justify-content-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="btn btn-second"
              >
                Back
              </button>
              {currentStep === steps.length - 1 ? (
                <button 
                  className='btn btn-success'
                  onClick={() => handleComplete(conditionUpdate)}
                >
                  Complete Appointment
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="btn btn-success"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
