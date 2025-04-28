import React, { useState } from 'react'
import Input from '../Regular/Input'
import { useStateContext } from '../../../Context';
import { uploadImage } from '../../../Context/constants';

export default function UpdateTest({
  setTestUpdate,
  handleClick,
  testUpdate
}) {
  const { setLoader, notifyError, notifySuccess } = useStateContext();

  const types = [
    {
      name: 'Blood'
    },
    {
      name: 'X-ray'
    }
  ];

  const handleImageChange = async (event) => {
    try {
      setLoader(true);

      const files = event.target.files;
      if (files) {
        const fileArray = Array.from(files);

        const uploadPromises = fileArray.map((file) => uploadImage(file));
        const imgUrls = await Promise.all(uploadPromises);

        setTestUpdate({ ...testUpdate, images: imgUrls });

        setLoader(false);
        notifySuccess('Image uploaded successfully');
      }
    } catch(error) {
      console.log(error);
      setLoader(false);
      notifyError('Upload image failed, please check again');
    }
  }

  return (
    <div>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Update Patient Test</h5>
          </div>
          <div className='modal-body'>
            <div>
              <div className='row'>
                <div className="col-xl-6">
                  <div className="form-group">
                    <label className="col-form-label">Type of test:</label>
                    <select 
                      className="form-control" 
                      onChange={(e) => setTestUpdate({ ...testUpdate, typeOfTest: e.target.value })}
                    >
                      <option value="">Select Type of Test</option>
                      {types.map((type, index) => (
                        <option key={index} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input 
                  name={'Result'}
                  type={'text'}
                  handleChange={(e) => setTestUpdate({ ...testUpdate, result: e.target.value })}
                />
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Upload Test Image:</label>
                    <input 
                      className='form-control'
                      id='file'
                      type='file'
                      multiple
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Diagnosis:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea2'
                      rows={3}
                      placeholder='Diagnosis'
                      defaultValue={''}
                      onChange={(e) => setTestUpdate({ ...testUpdate, diagnosis: e.target.value })}
                    />
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Notes:</label>
                    <textarea 
                      className='form-control'
                      id='exampleFormControlTextarea2'
                      rows={3}
                      placeholder='Note'
                      defaultValue={''}
                      onChange={(e) => setTestUpdate({ ...testUpdate, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              className='btn btn-success btn-block'
              onClick={handleClick}
            >
              Update Test Result
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
