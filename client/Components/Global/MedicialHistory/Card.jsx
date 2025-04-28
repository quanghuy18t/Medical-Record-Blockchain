import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context'

export default function Card({ item, doctor }) {
  const { 
    GET_PATIENT_DETAIL,
    GET_PRESCRIPTION_DETAIL,
    GET_TEST_DETAIL,
    GET_MEDICATION_DETAIL
  } = useStateContext();

  const [patient, setPatient] = useState(null);
  const [test, setTest] = useState([]);
  const [medication, setMedication] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      GET_PATIENT_DETAIL(item.patientID).then((patient) => {
        setPatient(patient);
      });

      const prescriptions = await Promise.all(
        item.prescriptions.map((id) => GET_PRESCRIPTION_DETAIL(id))
      );

      if (prescriptions) {
        const allMedications = prescriptions.flatMap(prescription => prescription.medications);

        const medications = await Promise.all(
          allMedications.map((id) => GET_MEDICATION_DETAIL(id))
        );
        console.log(medications);
        setMedication(medications);
      }

      const tests = await Promise.all(
        item.tests.map((id) => GET_TEST_DETAIL(id))
      );
      console.log(tests);
      setTest(tests);
    };

    fetchData();
  }, [item])

  return (
    <div
      className='modal fade'
      id={`exampleModal-${item.medicalID}`}
      tabIndex={-1}
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Medical Detail</h5>
            <button 
              className='btn-close'
              type='button'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <div className="row">
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <label className='col-form-label me-3'>Patient:</label>
                  <h4 className='col-form-label'>{patient?.name}</h4>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <label className='col-form-label me-3'>Examination Date :</label>
                  <h4 className='col-form-label'>{item.date}</h4>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <label className='col-form-label me-3'>Doctor:</label>
                  <h4 className='col-form-label'>{doctor?.name}</h4>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <label className='col-form-label me-3'>Hospital:</label>
                  <h4 className='col-form-label'>{item.hospitalName}</h4>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <label className='col-form-label me-3'>Symptoms:</label>
                  <h4 className='col-form-label'>{item.symptoms}</h4>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <label className='col-form-label me-3'>Diagnosis:</label>
                  <h4 className='col-form-label'>{item.diagnosis}</h4>
                </div>
              </div>
              <div className='col-xl-12'>
                <label>Test Result:</label>
                <table className='table table-bordered dataTableCard fs-14'>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Result</th>
                      <th>Diagnosis</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {test.map(data => (
                      <tr key={data.testID}>
                        <td>{data.typeOfTest}</td>
                        <td>{data.result}</td>
                        <td>{data.diagnosis}</td>
                        <td>{data.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='col-xl-12'>
                <label>Prescription:</label>
                <table className='table table-bordered dataTableCard fs-14'>
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medication.map(data => (
                      <tr key={data.id}>
                        <td>{data.medicine.name}</td>
                        <td>{data.dosage}</td>
                        <td>{data.frequency}</td>
                        <td>{data.duration}</td>
                        <td>{data.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}