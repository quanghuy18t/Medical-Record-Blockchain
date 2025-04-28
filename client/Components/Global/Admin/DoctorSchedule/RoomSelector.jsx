import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../../Context';

export default function RoomSelector({ specialization, onConfirm }) {
  const { GET_ROOM_DEPARTMENT } = useStateContext();

  const [selectedRoom, setSelectedRoom] = useState();
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (specialization) {
        const data = await GET_ROOM_DEPARTMENT(specialization);
        console.log(data);
        setRooms(data);
      }
    };

    fetchData();
  }, [specialization]);

  if (rooms.length) {
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
                Add Department
              </h5>
              <button 
                className='btn-close'
                type='button'
                data-bs-dismiss='modal'
                aria-label='Close'
              />
            </div>
            <div className='modal-body'>
              <div className='col-xl-12'>
                <label className='col-form-label'>Room</label>
                <select
                  className='form-control'
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  <option value={""}>Select Room</option>
                  {rooms.map((room, index) => (
                    <option key={index} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
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
                className='btn btn-primary'
                onClick={() => onConfirm(selectedRoom)}
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
