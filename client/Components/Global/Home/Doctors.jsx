import React from 'react';
import { TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter } from '../../ReactICON/index';

export default function Doctors({
  registerDoctor,
  setOpenComponent,
  setDoctorDetail
}) {
  return (
    <div className='col-xl-9 col-xxl-8 col-lg-7'>
      <div className='card'>
        <div className='card-header border-0 pb-0'>
          <h3 className='fs-20 mb-0 text-black'>Top Rated Doctors</h3>
          <a href='page-review.html' className='text-primary font-w500'>
            View more &gt;&gt;
          </a>
        </div>
        <div className='card-body'>
          <div className='assigned-doctor home-doctors'>
            {registerDoctor?.map((doctor, index) => (
              <div
                className='items'
                key={index}
                onClick={() => (
                  setDoctorDetail(doctor),
                  setOpenComponent("DoctorDetail")
                )}
              >
                <div className='text-center'>
                  <img 
                    style={{width: '150px'}}
                    className='home-doctors-img'
                    src={doctor.image}
                    alt="Doctor Image"
                  />
                  <div className='dr-start'>{doctor.doctorId}</div>
                  <h5 className='fs-16 mb-1 font-w600'>
                    <a className='text-black' href='page-review.html'>
                      DR. {doctor.name}
                    </a>
                  </h5>
                  <span className='text-primary mb-2 d-block'>
                    {doctor.specialization}
                  </span>
                  <p className='fs-12'>{doctor.yourAddress}</p>
                  <div className='social-media'>
                    <a href='javascript:void(0);'>
                      <i className='lab'>
                        <TiSocialTwitter />
                      </i>
                    </a>
                    <a href='javascript:void(0);'>
                      <i className='lab'>
                        <TiSocialFacebook />
                      </i>
                    </a>
                    <a href='javascript:void(0);'>
                      <i className='lab'>
                        <TiSocialLinkedin />
                      </i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
