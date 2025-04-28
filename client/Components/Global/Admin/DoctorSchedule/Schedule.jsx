import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useStateContext } from '../../../../Context';
import RoomSelector from './RoomSelector';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Schedule() {
  const { 
    GET_ALL_APPROVED_DOCTOR, 
    CREATE_SCHEDULE,
    GET_ALL_SCHEDULE
  } = useStateContext();

  const modalTrigger = useRef();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState([]);
  const [listDoctor, setListDoctor] = useState([]);
  const [selectedDoctorEvent, setSelectedDoctorEvent] = useState(null);

  const handleEventReceive = (info) => {
    const startTime = dayjs(info.event.startStr).tz('Asia/Ho_Chi_Minh');
    const endTime = startTime.add(4, 'hour');
  
    const newEvent = {
      id: `${info.event.id}-${startTime.format()}`,
      title: info.event.title,
      start: startTime.format('YYYY-MM-DDTHH:mm:ssZ'),
      end: endTime.format('YYYY-MM-DDTHH:mm:ssZ'),
      extendedProps: {
        ...info.event.extendedProps,
        doctorID: info.event.id,  
        start: startTime.format('YYYY-MM-DDTHH:mm:ssZ'),
        end: endTime.format('YYYY-MM-DDTHH:mm:ssZ'),
      }
    };
    console.log(newEvent);
    setSelectedDoctorEvent(newEvent);
    if (modalTrigger.current) {
      console.log(modalTrigger.current)
      modalTrigger.current.click();
    }
  };  

  const handleRoomSelected = (roomID) => {
    if (!selectedDoctorEvent || !roomID) return;

    const newEvent = {
      ...selectedDoctorEvent,
      extendedProps: {
        ...selectedDoctorEvent.extendedProps,
        roomID: roomID
      }
    };

    setEvents((prev) => {
      if (prev.some((event) => event.id === newEvent.id)) {
        return prev; 
      }
      return [...prev, newEvent];
    });

    setNewEvent((prev) => {
      if (prev.some((event) => event.id === newEvent.id)) {
        return prev; 
      }
      return [...prev, newEvent];
    });

    setSelectedDoctorEvent(null);
  }

  const handleEventClick = (info) => {
    setEvents((prev) => prev.filter((event) => event.id !== info.event.id));
    setNewEvent((prev) => prev.filter((event) => event.id !== info.event.id));
    info.event.remove();
  };

  const handleEventResize = (info) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.startStr,
              end: info.event.endStr
            }
          : event
      )
    );
  };

  const saveSchedule = async () => {
    const groupEvents = newEvent.reduce((acc, event) => {
      const day = dayjs(event.start).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

      if (!acc[day]) {
        acc[day] = {
          day: day,
          schedules: []
        };
      }

      acc[day].schedules.push({
        doctorID: event.extendedProps.doctorID,
        roomID: event.extendedProps.roomID,
        start: dayjs(event.start).tz('Asia/Ho_Chi_Minh').format('HH:mm'),
        end: dayjs(event.end).tz('Asia/Ho_Chi_Minh').format('HH:mm')
      });

      return acc
    }, {});
    console.log(groupEvents)
    await CREATE_SCHEDULE(Object.values(groupEvents));

    setNewEvent([]);
  }

  useEffect(() => {
    const fetchData = async () => {
      const doctors = await GET_ALL_APPROVED_DOCTOR();
      setListDoctor(doctors);

      const doctorMap = doctors.reduce((map, doc) => {
        map[doc.doctorID] = doc;
        return map;
      }, {});
  
      const events = await GET_ALL_SCHEDULE(doctorMap);
      setEvents(events);  
    };

    fetchData();
  }, []);

  useEffect(() => {
    const doctorList = document.getElementById('doctor-list');
    let draggableInstance = null;

    if (doctorList) {
      if (draggableInstance) {
        draggableInstance.destroy();
      }

      draggableInstance = new Draggable(doctorList, {
        itemSelector: '[data-event]',
        eventData: (eventEl) => {
          try {
            const eventData = JSON.parse(eventEl.getAttribute('data-event'));
            return eventData;
          } catch (error) {
            console.error("Error parsing data-event for element:", eventEl, error);
            return null;
          }
        }
      });

      const draggableItems = doctorList.querySelectorAll('[data-event]');
      draggableItems.forEach((item, index) => {
        console.log(`Item ${index}:`, item, item.getAttribute('data-event'));
      });
    }

    return () => {
      if (draggableInstance) {
        draggableInstance.destroy();
      }
    }
  }, [listDoctor]);

  return (
    <div className='d-flex gap-4 p-4'>
      <div className='width260 bg-white rounded-lg shadow-lg p-4'>
        <h2 className='mb-4'>Doctor List</h2>
        <div id='doctor-list' className='mt-2'>
          {listDoctor.map((doctor) => (
            <div
              key={doctor.id}
              className={`p-3 rounded-lg bg-primary text-white mb-2 cursor-grab`}
              data-event={JSON.stringify({
                title: doctor.name,
                id: doctor.doctorID,
                extendedProps: { specialization: doctor.specialization }
              })}
            >
              <div className='fw-medium'>{doctor.name}</div>
              <div className='text-sm opacity-90'>{doctor.specialization}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-grow-1 min-vh-100'>
        <FullCalendar 
          plugins={[timeGridPlugin, interactionPlugin]}
          timeZone='Asia/Ho_Chi_Minh'
          initialView='timeGridWeek'
          allDaySlot={false}
          slotMinTime={'8:00:00'}
          slotMaxTime={'17:00:00'}
          slotDuration={'0:30:00'}
          editable={true}
          droppable={true}
          eventDurationEditable={true}
          events={events}
          eventClick={handleEventClick}
          eventReceive={handleEventReceive}
          eventResize={handleEventResize}
          headerToolbar={{
            left: 'today',
            center: 'title',
            right: 'timeGridWeek'
          }}
        />
      </div>

      <div className='flex justify-end'>
        <button onClick={saveSchedule} className='btn btn-primary'>Save Schedule</button>
      </div>

      <a
        ref={modalTrigger}
        className='d-none'
        href='javascript:void(0)'
        data-bs-toggle='modal'
        data-bs-target='#exampleModal'
      >Select Room</a>

      <RoomSelector 
        specialization={selectedDoctorEvent?.extendedProps?.specialization}
        onConfirm={handleRoomSelected}
      />
    </div>
  )
}