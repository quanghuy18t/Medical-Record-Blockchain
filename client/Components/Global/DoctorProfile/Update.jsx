import React from 'react'
import Input from '../Regular/Input';
import { useFieldArray, useForm } from 'react-hook-form';
import { useStateContext } from '../../../Context';

export default function Update({
  setPrescriptionUpdate,
  registerMedicine,
  handleClick
}) {
  const { ADD_MEDICATION } = useStateContext();

  const { control, register, handleSubmit  } = useForm({
    defaultValues: {
      medications: [{
        medicineID: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: ""
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications"
  });

  const handleAddMedication = async (data) => {
    const newData = {
      ...data,
      quantity: Number(data.quantity)
    }
    const newMed = await ADD_MEDICATION(newData);
    console.log(newMed);
    
    setPrescriptionUpdate(prev => ({
      ...prev,
      medications: [...prev.medications, newMed.id]
    }));
  }

  return (
    <div className="">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Precribe Medicine</h5>
          </div>
          <div className="modal-body">
            <div>
              {fields.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="col-xl-12">
                    <div className="form-group">
                      <label className="col-form-label">Medicines:</label>
                      <select
                        className="form-control"
                        { ...register(`medications.${index}.medicineID`, {required: true}) }
                      >
                        <option value={""}>Select medicine</option>
                        {registerMedicine?.map((medicine) => (
                          <option key={medicine.medicineID} value={medicine?.medicineID}>
                            {medicine?.name} $ {medicine?.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='row'>
                    <Input 
                      name={"Dosage"}
                      value={`medications.${index}.dosage`}
                      type={"text"}
                      register={register}
                    />
                    <Input
                      name={"Frequency"} 
                      value={`medications.${index}.frequency`}
                      type={"text"}
                      register={register}
                    />
                    <Input
                      name={"Duration"}
                      value={`medications.${index}.duration`}
                      type={"text"}
                      register={register}
                    />
                    <Input 
                      name={"Quantity"}
                      value={`medications.${index}.quantity`}
                      type={"number"}
                      register={register}
                    />
                  </div>
                  <button
                    className='btn btn-danger light btn-block'
                    type='button'
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-secondary btn-block mb-3"
                onClick={handleSubmit (async (formData) => {
                  const data = { medicineID: '', dosage: '', frequency: '', duration: '', quantity: '' };
                  append(data);
                  await handleAddMedication(formData.medications[formData.medications.length - 1]);
                })}
              >
                Add New
              </button>
              <div className='d-flex justify-content-end'>
                <button
                  onClick={handleClick}
                  className="btn btn-success"
                >
                  Prescribe Medicine
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
