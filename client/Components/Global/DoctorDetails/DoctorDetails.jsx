import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import Header from './Header';
import AppoinmentList from './AppoinmentList';
import Card from './Card';
import { 
  DoctorDetails1,
  DoctorDetails2,
  DoctorDetails3, 
  DoctorDetails4,
  DoctorDetails5
} from '../../SVG/index';
import { SHORTEN_ADDRESS } from '../../../Context/constants';
import { FaRegCopy } from '../../ReactICON/index';

export default function DoctorDetails({
  doctorDetail,
  setOpenComponent
}) {
  const { notifySuccess, GET_DOCTOR_APPOINTMENT_HISTORY } = useStateContext();

  const [doctorAppoinment, setDoctorAppoinment] = useState();
  const [registerMedicine, setRegisterMedicine] = useState();

  useEffect(() => {
    const fetchData = async () => {
      GET_DOCTOR_APPOINTMENT_HISTORY(doctorDetail.doctorID).then((appointment) => {
        console.log(appointment);
        setDoctorAppoinment(appointment);
      });
    };

    fetchData();
  }, [doctorDetail]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess('Copied successfully');
  };

  return (
    <div className='container-fluid'>
      <Header setOpenComponent={setOpenComponent} />

      <div className='row'>
        <div className='col-xl-3 col-lg-4 col-xxl-4'>
          <div className='card'>
            {doctorAppoinment?.length ? (
              <div className='card-header border-0 pb-0'>
                <h4 className='fs-20 font-w600 mb-0'>Appointment List</h4>
              </div>
            ) : ("")}
            <div className='card-body px-0 pt-4'>
              <div
                className='widget-media dz-scroll px-4 height370'
                id='DZ_W_Todo2'
              >
                {doctorAppoinment?.length ? (
                  <ul className='timeline'>
                    {doctorAppoinment?.map((item, index) => (
                      <AppoinmentList 
                        item={item}
                        index={index}
                      />
                    ))}
                  </ul>
                ) : (
                  <img 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    src='appointment.jpg'
                    alt='Appointment'
                  />
                )}
              </div>
              <div style={{marginTop:'3rem', padding:'1rem'}}>
                <Card 
                  icon={<DoctorDetails3 />}
                  title={'Total Appointment:'}
                  name={doctorDetail?.appointmentCount}
                />
                <Card 
                  icon={<DoctorDetails3 />}
                  title={doctorDetail?.successfulTreatmentCount}
                  name={'Successful Treatment:'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-xxl-8 col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="media d-sm-flex d-block text-center text-sm-start pb-4 mb-4 border-bottom">
                <img
                  alt="image"
                  className="rounded me-sm-4 me-0"
                  width={130}
                  src={doctorDetail?.image}
                />
                <div className="media-body align-items-center">
                  <div className="d-sm-flex d-block justify-content-between my-3 my-sm-0">
                    <div>
                      <h3 className="fs-22 text-black font-w600 mb-0">
                        {doctorDetail?.namet}
                      </h3>
                      <p className="mb-2 mb-sm-2">
                        {SHORTEN_ADDRESS(doctorDetail?.walletAddress)}{" "}
                        <a
                          onClick={() => copyText(doctorDetail?.walletAddress)}
                        >
                          {" "}
                          <FaRegCopy />
                        </a>
                      </p>
                    </div>
                    <span>{doctorDetail?.doctorID}</span>
                  </div>
                  <a className="btn btn-primary light btn-rounded mb-2 me-2">
                    <DoctorDetails1 />
                    {doctorDetail?.gender}
                  </a>
                  <a className="btn btn-primary light btn-rounded mb-2">
                    <DoctorDetails2 />
                    {doctorDetail?.specialization}
                  </a>
                  <a className="btn btn-primary light btn-rounded mb-2">
                    <DoctorDetails2 />
                    {doctorDetail?.degree}
                  </a>
                </div>
              </div>
              <div className="row">
                <Card
                  name={doctorDetail?.yourAddress}
                  title={"Doctor Address"}
                  icon={<DoctorDetails3 />}
                />
                <Card
                  name={doctorDetail?.phone}
                  title={"Phone"}
                  icon={<DoctorDetails4 />}
                />
                <Card
                  name={doctorDetail?.email}
                  title={"Email"}
                  icon={<DoctorDetails5 />}
                />
                <Card
                  name={doctorDetail?.designation}
                  title={"Designation"}
                  icon={<DoctorDetails3 />}
                />
              </div>
              <hr />
              <div className="mt-5">
                <h4 className="fs-20 font-w600">
                  About Dr. {doctorDetail?.name}
                </h4>
                <div className="staff-info">
                  <p>{doctorDetail?.biography}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
