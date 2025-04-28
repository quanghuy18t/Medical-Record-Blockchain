import React, { useEffect, useState } from 'react'
import Card from '../Regular/Card';
import CardContent from '../Regular/CardContent';
import { useStateContext } from '../../../Context';
import { ImFilePicture } from 'react-icons/im';

export default function MedicalDetail() {
  const { 
    medicalDetail,
    GET_DOCTOR_DETAIL,
    GET_PRESCRIPTION_DETAIL,
    GET_TEST_DETAIL,
    GET_MEDICATION_DETAIL
  } = useStateContext();
  
  const [doctor, setDoctor] = useState(null);
  const [test, setTest] = useState([]);
  const [medication, setMedication] = useState([]);

  const [testImage, setTestImage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      GET_DOCTOR_DETAIL(medicalDetail.doctorID).then((doc) => {
        setDoctor(doc);
      });

      const prescriptions = await Promise.all(
        medicalDetail.prescriptions.map((id) => GET_PRESCRIPTION_DETAIL(id))
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
        medicalDetail.tests.map((id) => GET_TEST_DETAIL(id))
      );
      setTest(tests);
    };

    fetchData();
  }, [medicalDetail])

  return (
    <div className="p-2 d-grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Patient Info */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Result</h2>
            </div>
            <div className="mt-4 row">
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <h4 className='col-form-label me-3'>Doctor:</h4>
                  <label className='col-form-label'>{doctor?.name}</label>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <h4 className='col-form-label me-3'>Hospital:</h4>
                  <label className='col-form-label'>{medicalDetail.hospitalName}</label>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <h4 className='col-form-label me-3'>Room:</h4>
                  <label className='col-form-label'>Room 1</label>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <h4 className='col-form-label me-3'>Department:</h4>
                  <label className='col-form-label'>{doctor?.specialization}</label>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <h4 className='col-form-label me-3'>Symptom:</h4>
                  <label className='col-form-label'>{medicalDetail.symptoms}</label>
                </div>
              </div>
              <div className='col-xl-6'>
                <div className='d-flex form-group'>
                  <h4 className='col-form-label me-3'>Diagnosis:</h4>
                  <label className='col-form-label'>{medicalDetail.diagnosis}</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">Test Result</h2>
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
                        <td>
                          <a
                            className='btn btn-primary light'
                            onClick={() => setTestImage(data.images)}
                            href='javascript:void();'
                            data-bs-toggle='modal'
                            data-bs-target='#exampleModal'
                          >
                            <ImFilePicture /> See
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </CardContent>
        </Card>

        {/* Imaging Results */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">Prescription</h2>
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
                    {medication?.map(data => (
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
          </CardContent>
        </Card>

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
                <button 
                  className='btn-close'
                  type='button'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                />
              </div>
              <div className='modal-body'>
                <div>
                  <div className='row'>
                    {testImage?.map(data => (
                      <img 
                        src={data}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
