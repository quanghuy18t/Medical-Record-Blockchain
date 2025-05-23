import React, { useState } from 'react'
import { useStateContext } from '../../../../Context'
import Input from '../../Regular/Input';
import { uploadImage } from '../../../../Context/constants';

export default function AddDoctor() {
  const {
    setLoader,
    notifySuccess,
    notifyError,
    addDoctor
  } = useStateContext();

  const [doctor, setDoctor] = useState({
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    degree: '',
    yourAddress: '',
    designation: '',
    lastWork: '',
    mobile: '',
    email: '',
    collageName: '',
    collageID: '',
    joiningYear: '',
    endYear: '',
    specialization: '',
    registrationID: '',
    collageAddress: '',
    image: '',
    biography: '',
  });

  const handleImageChange = async (event) => {
    try {
      setLoader(true);
      const file = event.target.files[0];
      if (file) {
        const imgUrl = await uploadImage(file);
        console.log(imgUrl);
        setDoctor({ ...doctor, image: imgUrl });
        setLoader(false);
        notifySuccess('Image uploaded successfully');
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      notifyError('Failed uploaded');
    }
  };

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
              Add Doctor
            </h5>
            <button 
              className='btn-close'
              type='button'
              data-bs-dimiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <div>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Title:</label>
                    <select
                      className='form-control'
                      onChange={(e) => setDoctor({ ...doctor, title: e.target.value })}
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
                  handleChange={(e) => setDoctor({ ...doctor, firstName: e.target.value })}
                />
                <Input 
                  name={'Last Name'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, lastName: e.target.value })}
                />
                <Input 
                  name={'Gender'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
                />
                <Input 
                  name={'Degree'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, degree: e.target.value })}
                />
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Address:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea1'
                      rows={3}
                      defaultValue={''}
                      onChange={(e) => setDoctor({ ...doctor, yourAddress: e.target.value })}
                    />
                  </div>
                </div>{" "}
                <Input 
                  name={'Designation'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, designation: e.target.value })}
                />
                <Input 
                  name={'Last Work'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, lastWork: e.target.value })}
                />
                <Input 
                  name={'Mobile'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, mobile: e.target.value })}
                />
                <Input 
                  name={'Email'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                />
                <Input 
                  name={'Collage Name'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, collageName: e.target.value })}
                />
                <Input 
                  name={'Collage ID'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, collageID: e.target.value })}
                />
                <Input 
                  name={'Joining Year'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, joiningYear: e.target.value })}
                />
                <Input 
                  name={'End Year'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, endYear: e.target.value })}
                />
                <Input 
                  name={'Specialization'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                />
                <Input 
                  name={'Registration ID'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, registrationID: e.target.value })}
                />
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Collage Address:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea1'
                      rows={3}
                      defaultValue={''}
                      onChange={(e) => setDoctor({ ...doctor, collageAddress: e.target.value })}
                    />
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Upload Profile</label>
                    <input 
                      className='form-control'
                      id='file'
                      type='file'
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Biography:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea2'
                      rows={3}
                      defaultValue={''}
                      onChange={(e) => setDoctor({ ...doctor, biography: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dimiss='modal'
            >
              Close
            </button>
            <button
              className='btn btn-primary'
              onClick={() => addDoctor(doctor)}
            >
              Add Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
