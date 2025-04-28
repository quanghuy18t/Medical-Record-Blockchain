import React from 'react'
import Header from './Header'
import Card from './Card'
import Revenue from './Revenue'
import Statistic from './Statistic'
import Doctors from './Doctors'
import Patient from './Patient'
import { 
  Header1,
  HeroCard1, 
  HeroCard2, 
  HeroCard3, 
  HeroCard4, 
  HeroCard5,
  HeroCard6,
  HeroCard7,
  HeroCard8
} from '../../SVG'

export default function Home({
  registerDoctor,
  registerPatient,
  setPatientDetail,
  setOpenComponent,
  setDoctorDetail,
  notification,
  allAppointment,
  accountBalance,
  currency
}) {
  return (
    <div className="container-fluid">
      <Header />
      <div className='row'>
        <Card 
          title={'Total Patient'}
          patient={`${registerPatient?.length}`}
          number={'4'}
          iconOne={<HeroCard1 />}
          iconTwo={<HeroCard2 />}
          classStyle={'bg-danger'}
        />
        <Card 
          title={'Doctor'}
          patient={`${registerDoctor?.length}`}
          number={'4'}
          iconOne={<HeroCard3 />}
          iconTwo={<HeroCard4 />}
          classStyle={'bg-success'}
        />
        <Card
          title={"Appointment"}
          patient={`${allAppointment?.length}`}
          number={"2"}
          iconOne={<HeroCard5 />}
          iconTwo={<HeroCard6 />}
          classStyle={"bg-info"}
        />
        <Card 
          title={'Notification'}
          patient={0}
          number={'5'}
          iconOne={<HeroCard7 />}
          iconTwo={<Header1 />}
          classStyle={'bg-secondary'}
        />
        <Revenue 
          accountBalance={accountBalance}
          currency={"MED"}
        />
        <Statistic />
        <Doctors 
          registerDoctor={registerDoctor}
          setOpenComponent={setOpenComponent}
          setDoctorDetail={setDoctorDetail}
        />
        <Patient 
          registerPatient={registerPatient}
          setOpenComponent={setOpenComponent}
          setPatientDetail={setPatientDetail}
        />
      </div>
    </div>
  );
};
