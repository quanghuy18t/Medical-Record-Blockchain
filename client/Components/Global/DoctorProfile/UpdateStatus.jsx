import React from 'react'
import Input from '../Regular/Input'

export default function UpdateStatus({
  setConditionUpdate,
  conditionUpdate
}) {  
  return (
    <div>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Patient Medical</h5>
          </div>
          <div className="modal-body">
            <div>
              <div className='row'>
                <Input 
                  name={'Symptom'}
                  type={'text'}
                  handleChange={(e) => setConditionUpdate({ ...conditionUpdate, symptoms: e.target.value })}
                />
                <Input 
                  name={'Diagnosis'}
                  type={'text'}
                  handleChange={(e) => setConditionUpdate({ ...conditionUpdate, diagnosis: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
