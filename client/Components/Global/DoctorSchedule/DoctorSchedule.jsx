import FullCalendar from '@fullcalendar/react'
import React, { useEffect, useState } from 'react'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useStateContext } from '../../../Context';

export default function DoctorSchedule({ user }) {
  const { GET_SCHEDULE_BY_DOCTOR } = useStateContext();
  
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const event = await GET_SCHEDULE_BY_DOCTOR(user.doctorID);
      setEvents(event);
    };

    fetchData();
  }, [user]);

  return (
    <div className='flex-grow-1 min-vh-100 p-4'>
      <FullCalendar 
        plugins={[timeGridPlugin]}
        timeZone='Asia/Ho_Chi_Minh'
        initialView='timeGridWeek'
        allDaySlot={false}
        slotMinTime={'8:00:00'}
        slotMaxTime={'18:00:00'}
        slotDuration={'0:30:00'}
        events={events}
        headerToolbar={{
          left:'today',
          center:'title',
          right:'timeGridWeek'
        }}
      />
    </div>
  )
}
