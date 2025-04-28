import React, { useState } from 'react'
import { useStateContext } from '../../../Context'
import Input from '../Regular/Input';
import { uploadImage } from '../../../Context/constants';

export default function AddPatient({ setAddPatient }) {
  const { REGISTER_PATIENT, setLoader, notifySuccess, notifyError } = useStateContext();

  const [patient, setPatient] = useState({
    walletAddress: '0x2ADA8Bb0c85eFa642e28963155C7763720b13B61',
    name: 'Võ Văn An',
    image: '',
    gender: 'Male',
    birth: '',
    yourAddress: 'Bình Dương',
    phone: '0123948567',
    email: 'vanan@gmail.com',
    insurance: '0740981746532',
    notes: 'Tiền sử bệnh phong thấp'
  });

  const handleImageChange = async (event) => {
    try {
      setLoader(true);

      const file = event.target.files[0];
      if (file) {
        const imgUrl = await uploadImage(file);
        setPatient({ ...patient, image: imgUrl });

        setLoader(false);
        notifySuccess('Image uploaded successfully');
      }
    } catch(error) {
      console.log(error);
      setLoader(false);
    }
  }

  return (
    <div className='modal' style={{display: 'block'}}>
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Add Patient</h5>
            <button className='btn-close' onClick={() => setAddPatient(false)} />
          </div>
          <div className='modal-body'>
            <div>
              <div className='row'>
                <Input 
                  name={'Name'}
                  type={'text'}
                  handleChange={(e) => setPatient({ ...patient, name: e.target.value })}
                />
                <Input 
                  name={'Date of birth'}
                  type={'date'}
                  handleChange={(e) => setPatient({ ...patient, birth: e.target.value })}
                />
                <Input 
                  name={'Email'}
                  type={'email'}
                  handleChange={(e) => setPatient({ ...patient, email: e.target.value })}
                />
                <Input 
                  name={'Phone'}
                  type={'text'}
                  handleChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                />
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Upload Image:</label>
                    <input 
                      className='form-control'
                      id='file'
                      type='file'
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="col-xl-12">
                  <div className="form-group">
                    <label className="col-form-label">Wallet Address:</label>
                    <input
                      size={16}
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setPatient({ ...patient, walletAddress: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="form-group">
                    <label className="col-form-label">Gender:</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setPatient({ ...patient, gender: e.target.value })
                      }
                    >
                      <option value={""}>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
                <Input 
                  name={'Insurance'}
                  type={'text'}
                  handleChange={(e) => setPatient({ ...patient, insurance: e.target.value })}
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
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Note:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea2'
                      rows={3}
                      defaultValue={''}
                      onChange={(e) => setPatient({ ...patient, notes: e.target.value })}
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
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              onClick={() => REGISTER_PATIENT(patient)}
              className='btn btn-primary'
            >
              Register Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
