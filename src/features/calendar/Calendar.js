import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/lt";
import styles from './Calendar.module.css'
import { 
    setFormType, selectCurrentEvent, toggleShowModal, updateEventData, fetchEventsByLocation, filterEventsByLocation } from "./calendarSlice";
import { setNotification, 
    isNotificationOpen } from "../notification/notificationSlice";
import { fetchUsers, getUserColors } from "../users/usersSlice";
import LocationBtn from "./LocationBtn";
import { EventForm } from "./EventForm";


moment.locale('lt', {
    week: {
        dow: 1,
        doy: 1,
    }
})

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);


function MainCalendar() {
    const dispatch = useDispatch()
    const location = useSelector(state => state.calendar.currentLocation)
    const events = useSelector(state => filterEventsByLocation(state, location))
    const open = useSelector(state => state.calendar.showModal)
    const notificationIsOpen = useSelector(isNotificationOpen)
    const userColors = useSelector(state => getUserColors(state))



    useEffect(() => {
        // https://github.com/facebook/react/issues/14326
        let didCancel = false

        async function fetchAPI() {
            try {
                await dispatch(fetchEventsByLocation(location)).unwrap()
            }
            catch {
                // error catched in reject case
                // swallow error
            }
            if (!didCancel) {}
        }
        if (!notificationIsOpen) {
            fetchAPI()
        }
        return () => {didCancel = true}
           
    }, [dispatch, 
        location,
        notificationIsOpen, // do fetch if notification is closed
    ])
    
    useEffect(() => {
        let didCancel = false

        async function dofetchUsers() {
            try {
                await dispatch(fetchUsers()).unwrap()
            }
            catch {
                // error catched in reject case
                // swallow error
            }
            if (!didCancel) {}
        }
        dofetchUsers()

        return () => {didCancel = true}
           
    }, [dispatch, ]) 

    const handleEventDrop = async (data) => {
        const { start, end } = data
        const updatedEvent = {
            ...data.event,
            start: start.toISOString(),
            end: end.toISOString()
        }        
        try {
            await dispatch(updateEventData(updatedEvent)).unwrap()
        } catch (err) {
            dispatch(setNotification({message: err.message, type: 'error'}))
        }
    };

    const handleSelectEvent = (data) => {
        dispatch(setFormType('update'))
        dispatch(selectCurrentEvent(data))
        dispatch(toggleShowModal())
    }

    const handleSelectSlot = (data) => {
        const {start, end} = data
        dispatch(setFormType('add'))
        dispatch(selectCurrentEvent({
            location,
            start: start.toISOString(),
            end: end.toISOString()
        }))
        dispatch(toggleShowModal())
    }

    const eventStyleGetter = (event) => {
        const userColor = userColors[event.userId]
        const style = {
            backgroundColor: userColor,
        }
        return {
            style: style
        }
    }

    return (
        <div className={styles.MainCalendar}>

            <LocationBtn />
            
            <DnDCalendar
                style={{ height: '75vh' }}
                defaultDate={moment().toDate()}
                defaultView="month"
                events={events}
                localizer={localizer}
                selectable
                onEventDrop={handleEventDrop}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={eventStyleGetter}
            />
            
            {open && <EventForm open={open}/>}

        </div>
    );
}


export default MainCalendar;