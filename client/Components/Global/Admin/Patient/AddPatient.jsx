import React, { useState } from 'react'
import { useStateContext } from '../../../../Context'
import Input from '../../Regular/Input';
import { uploadImage } from '../../../../Context/constants';

export default function AddPatient({ registerDoctor }) {
  const {
    setLoader,
    notifySuccess,
    notifyError,
    addPatient
  } = useStateContext();

  const [doctor, setDoctor] = useState();
  const [patient, setPatient] = useState({
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    medicalHistory: '',
    yourAddress: '',
    mobile: '',
    email: '',
    birth: '',
    iamge: '',
    message: '',
    city: '',
  });

  const handleImageChange = async (event) => {
    try {
      setLoader(true);
      const file = event.target.files[0];
      if (file) {
        const img = await uploadImage(file);
        setPatient({ ...patient, iamge: img });
        setLoader(false);
        notifySuccess('Image uploaded successfully');
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      notifyError('Failed uploaded');
    }
  };

  const handleChange = (e) => {
    const selectedID = parseInt(e.target.value);
    const doctor = registerDoctor.find((doc) => doc.doctorId === selectedID);
    setDoctor(doctor);
  }

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
            <h5 className='modal-title' id='exampleModalLabel'>
              Add Patient
            </h5>
            <button 
              type='button'
              className='btn-close'
              data-bs-dimiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <form>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Title</label>
                    <select
                      className='form-control'
                      onChange={(e) => (
                        setPatient({
                          ...patient,
                          title: e.target.value
                        })
                      )}
                    >
                      <option value='Miss'>Miss</option>
                      <option value='Mr.'>Mr.</option>
                      <option value='Mrs.'>Mrs.</option>
                    </select>
                  </div>
                </div>
                <Input 
                  name={'First Name'}
                  type={'text'}
                  handleChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                />
                <Input 
                  name={'Last Name'}
                  type={'text'}
                  handleChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                />
                <Input 
                  name={'Gender'}
                  type={'text'}
                  handleChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                />
                <Input 
                  name={"Injury/Condition"}
                  type={"text"}
                  handleChange={(e) => setPatient({ ...patient, medicalHistory: e.target.value })}
                />
                <Input
                  name={"Phone"}
                  type={"text"}
                  handleChange={(e) => setPatient({ ...patient, mobile: e.target.value })}
                />
                <Input
                  name={"Email"}
                  type={"text"}
                  handleChange={(e) => setPatient({ ...patient, emailID: e.target.value })}
                />
                <Input
                  name={"Date Of Birth"}
                  type={"date"}
                  handleChange={(e) => setPatient({ ...patient, birth: e.target.value })}
                />
                <Input
                  name={"City"}
                  type={"text"}
                  handleChange={(e) => setPatient({ ...patient, city: e.target.value })}
                />
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Address:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea1'
                      rows={3}
                      defaultValue={''}
                      onChange={(e) => setPatient({ ...patient, yourAddress: e.target.value })}
                    />
                  </div>
                </div>
                <div className='col-xl-6'>
                  <div className='form-group'>
                    <label className='col-form-label'>Consulting Doctor:</label>
                    <select className='form-control' onChange={handleChange}>
                      <option value=''>Select Doctor</option>
                      {registerDoctor?.map((doctor, index) => (
                        <option key={index} value={doctor?.doctorId}>
                          {doctor?.title} {doctor?.firstName} {doctor?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>{" "}
                <div className='col-xl-6'>
                  <div className='form-group'>
                    <label className='col-form-label'>Upload Profile</label>
                    <input 
                      className='form-control'
                      id='file'
                      size={16}
                      type='file'
                      onChange={handleImageChange}
                    />
                  </div>
                </div>{" "}
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Message:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea2'
                      rows={3}
                      defaultValue={''}
                      onChange={(e) => setPatient({ ...patient, message: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='modal-footer'>
            <button
              className='btn btn-danger light'
              type='button'
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              className='btn btn-primary'
              onClick={() => addPatient(patient, doctor)}
            >
              Add Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
