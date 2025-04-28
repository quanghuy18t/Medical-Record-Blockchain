import React from 'react'
import {
  BsRobot,
  CgMenuGridR,
  FaArrowRightLong,
  FaShoppingBag,
  FaUserAlt,
  MdEmail,
  SlCalender
} from '../../ReactICON/index'
import Link from './Link'

export default function SideBar({ 
  setOpenComponent,
  user,
  setPatientDetail,
  setDoctorDetail,
  userType
}) {
  return (
    <div className='deznav'>
      <div className='deznav-scroll'>
        <ul className='metismenu' id='menu'>
          {userType == 'Admin' && (
            <li>
              <a className='has-arrow ai-icon' aria-expanded='false'>
                <i>
                  <CgMenuGridR />
                </i>
                <span 
                  className='nav-text'
                  onClick={() => setOpenComponent("Home")}
                >
                  Dashboard
                </span>
              </a>

              <ul aria-expanded='false'>
                <Link
                  name={"Patient"}
                  handleClick={() => setOpenComponent("Patient")}
                />
                <Link
                  name={"Doctor"}
                  handleClick={() => setOpenComponent("Doctor")}
                />
                <Link 
                  name={"Schedule"}
                  handleClick={() => setOpenComponent("Schedule")}
                />
                <Link 
                  name={"Department"}
                  handleClick={() => setOpenComponent("Department")}
                />
                <Link
                  name={"Medicine"}
                  handleClick={() => setOpenComponent("Medicine")}
                />
                <Link
                  name={"Appointment"}
                  handleClick={() => setOpenComponent("All Appointment")}
                />
              </ul>
            </li>
          )}

          {userType == 'Patient' && (
            <li>
              <a
                className='ai-icon'
                aria-expanded='false'
                onClick={() => setOpenComponent('Appointment')}
              >
                <i>
                  <SlCalender />
                </i>
                <span className='nav-text'>Appointment</span>
              </a>
            </li>
          )}

          {(userType == 'Doctor' || userType == 'Patient') && (
            <li>
              <a className='has-arrow ai-icon' aria-expanded='false'>
                <i>
                  <FaUserAlt />
                </i>
                <span className='nav-text'>Profile</span>
              </a>
              <ul aria-expanded='false'>
                <li>
                  <a
                    onClick={() => {
                      if (userType === 'Patient') {
                        setPatientDetail(user);
                        setOpenComponent('PatientProfile');
                      } else {
                        setDoctorDetail(user);
                        setOpenComponent('DoctorProfile');
                      }
                    }}
                  >
                    Profile
                  </a>
                </li>
                {/* <li>
                  <a
                    onClick={() => setOpenComponent("Notifications")}
                  >
                    Notifications
                  </a>
                </li> */}
                {/* {userType == "Patient" && (
                  <Link
                    name={"Order"}
                    handleClick={() => setOpenComponent("Order")}
                  />
                )} */}
                {/* {userType == "Patient" && (
                  <Link
                    name={"Prescription"}
                    handleClick={() => setOpenComponent("Prescription")}
                  />
                )} */}
                {userType == "Patient" && (
                  <Link
                    name={"Medical"}
                    handleClick={() => setOpenComponent("MedicalHistory")}
                  />
                )}
                {userType == "Doctor" && (
                  <Link
                    name={"Appointment"}
                    handleClick={() => setOpenComponent("YourAppointment")}
                  />
                )}
                {userType == "Doctor" && (
                  <Link 
                    name={"Schedule"}
                    handleClick={() => setOpenComponent("DoctorSchedule")}
                  />
                )}
              </ul>
            </li>
          )}
        </ul>
        {/* <div className="copyright">
          <p className="fs-14 font-w200">
            <strong className="font-w400">Hospital Admin Dashboard</strong>©
            2025 All Rights Reserved
          </p>
          <p className="fs-12">
            Made with <span className="heart" /> by @quanghuy
          </p>
        </div> */}
      </div>
    </div>
  )
}
