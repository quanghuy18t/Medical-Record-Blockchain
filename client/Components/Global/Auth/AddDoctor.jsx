import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context'
import { uploadImage } from '../../../Context/constants';
import Input from '../Regular/Input';

export default function AddDoctor({ setAddDoctor }) {
  const { 
    REGISTER_DOCTOR,
    GET_ALL_DEPARTMENT,
    address,
    setLoader, 
    notifySuccess, 
    notifyError 
  } = useStateContext();

  const [listDepartment, setListDepartment] = useState([]);
  const [doctor, setDoctor] = useState({
    walletAddress: '',
    name: '',
    image: '',
    gender: '',
    birth: '',
    degree: '',
    yourAddress: '',
    phone: '',
    email: '',
    designation: '',
    specialization: '',
    biography: ''
  });

  const handleImageChange = async (event) => {
    try {
      setLoader(true);

      const file = event.target.files[0];
      if (file) {
        const imgUrl = await uploadImage(file);
        setDoctor({ ...doctor, image: imgUrl });

        setLoader(false);
        notifySuccess('Image uploaded successfully');
      }
    } catch(error) {
      console.log(error);
      setLoader(false);
      notifyError('Upload image failed, please check again');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_DEPARTMENT().then((department) => {
        setListDepartment(department);
      });
    };
    
    fetchData();
  }, [address]);
  
  return (
    <div className='modal' style={{display: 'block'}}>
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Add Doctor</h5>
            <button className='btn-close' onClick={() => setAddDoctor(false)} />
          </div>
          <div className='modal-body'>
            <div>
              <div className='row'>
                <Input 
                  name={'Name'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                />
                <Input 
                  name={'Date of birth'}
                  type={'date'}
                  handleChange={(e) => setDoctor({ ...doctor, birth: e.target.value })}
                />
                <Input 
                  name={'Email'}
                  type={'email'}
                  handleChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                />
                <Input 
                  name={'Phone'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, phone: e.target.value })}
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
                        setDoctor({ ...doctor, walletAddress: e.target.value })
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
                        setDoctor({ ...doctor, gender: e.target.value })
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
                </div>
                <Input 
                  name={'Designation'}
                  type={'text'}
                  handleChange={(e) => setDoctor({ ...doctor, designation: e.target.value })}
                />
                <div className='col-xl-6'>
                  <div className='form-group'>
                    <label className='col-form-label'>Specialization:</label>
                    <select
                      className='form-control'
                      onChange={(e) => {
                        console.log(e.target.value)
                        setDoctor({ ...doctor, specialization: e.target.value })
                      }}
                    >
                      <option value={""}>Select Specialization</option>
                      {listDepartment.map((department, index) => (
                        <option key={index} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </select>
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
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              onClick={() => REGISTER_DOCTOR(doctor)}
              className='btn btn-primary'
            >
              Add Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
