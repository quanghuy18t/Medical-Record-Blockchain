import React from 'react'

export default function Patient({
  registerPatient,
  setPatientDetail,
  setOpenComponent
}) {
  return (
    <div className="col-xl-3 col-xxl-4 col-lg-5">
      <div className="card border-0 pb-0">
        <div className="card-header flex-wrap border-0 pb-0">
          <h3 className="fs-20 mb-0 text-black">Recent Patient</h3>
          <a href="patient-list.html" className="text-primary font-w500">
            View more &gt;&gt;
          </a>
        </div>
        <div className="card-body recent-patient px-0">
          <div
            id="DZ_W_Todo2"
            className="widget-media px-4 dz-scroll height320"
          >
            <ul className="timeline">
              {registerPatient?.map((patient, index) => (
                <li
                  onClick={() => (
                    setPatientDetail(patient),
                    setOpenComponent("PatientProfile")
                  )}
                >
                  <div key={patient.name} className="timeline-panel flex-wrap">
                    <div className="media me-3">
                      <img
                        className="rounded-circle"
                        alt="image"
                        width={50}
                        src={patient.image}
                      />
                    </div>
                    <div className="media-body">
                      <h5 className="mb-1">
                        <a className="text-black">
                          {patient.name}
                        </a>
                      </h5>
                      <span className="fs-14">{patient.yourAddress}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
