import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useStateContext } from '../../../Context'
import utc from 'dayjs/plugin/utc'
import TableList4 from '../../SVG/TableList4'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

dayjs.extend(utc)

export default function TableList({
  item,
  setDoctorDetails,
  setOpenComponent
}) {
  const { 
    GET_ROOM_BY_ID, 
    GET_DOCTOR_DETAIL, 
    APPOINTMENT_PAYMENT,
    APPOINTMENT_CAPTURE,
    CANCEL_APPOINTMENT
  } = useStateContext();

  const [roomName, setRoomName] = useState('');
  const [doctor, setDoctor] = useState('');
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const room = await GET_ROOM_BY_ID(item.roomID);
      setRoomName(room.name);

      const doctorInfo = await GET_DOCTOR_DETAIL(item.doctorID);
      setDoctor(doctorInfo);
    };

    fetchData();
  }, [item]);

  const handlePayment = async (appointmentID) => {
    try {
      const data = await APPOINTMENT_PAYMENT();

      setOrderID(data);
      setShowPayPalButton(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleApprove = async (orderID, appointmentID) => {
    try {
      await APPOINTMENT_CAPTURE(orderID, appointmentID);

      setShowPayPalButton(false);
    } catch (error) {
      console.log(error);
    }
  } 

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID,
      }}
    >
      <tr key={item.id}>
        <td>
          <div className='d-flex align-items-center'>
            <div className="checkbox text-end align-self-center">
              <div className="form-check custom-checkbox align-self-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="customCheckBox1"
                  required=""
                />
                <label className="form-check-label" htmlFor="customCheckBox1" />
              </div>
            </div>
          </div>
        </td>
        <td>{dayjs(item.day).format('DD-MM-YYYY')}</td>
        <td>{dayjs(item.time).utc().format('HH:mm')}</td>
        <td>{roomName}</td>
        <td>{item.queueNo}</td>
        <td>{doctor?.name}</td>
        {/* <td>
          <a
            onClick={() => (
              setDoctorDetails(item?.doctor), setOpenComponent("DoctorDetail")
            )}
            className="btn btn-primary light btn-rounded mb-2 me-2"
          >
            View Doctor
          </a>
        </td> */}
        <td>
          <div className='d-flex align-items-center'>
            <span
              className={`btn ${
                item.status === 'completed' ? "btn-primary" : item.status === 'cancelled' ? "btn-warning" : "btn-danger"
              } light btn-rounded mb-2 me-2`}
            >
              {item.status}
            </span>
            <div className='dropdown ms-auto c-pointer text-end'>
              <div className='btn-link' data-bs-toggle='dropdown'>
                <TableList4 />
              </div>
              <div className='dropdown-menu dropdown-menu-right'>
                {!item.payment && (
                  <a
                    className='dropdown-item'
                    onClick={() => handlePayment(item.id)}
                  >
                    Payment Online
                  </a>
                )}
                {(item.status !== 'completed' && !item.payment) && (
                  <a
                    className='dropdown-item'
                    onClick={() => CANCEL_APPOINTMENT(item.id)}
                  >
                    Cancel
                  </a>
                )}
              </div>
            </div>
          </div>
          {showPayPalButton && orderID && (
            <div>
              <PayPalButtons 
                createOrder={() => orderID}
                onApprove={() => handleApprove(orderID, item.id)}
                onCancel={() => setShowPayPalButton(false)}
              />
            </div>
          )}
        </td>
      </tr>
    </PayPalScriptProvider>
  )
}
