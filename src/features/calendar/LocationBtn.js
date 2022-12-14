import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useSelector, useDispatch } from 'react-redux';

import { setCurrentLocation } from './calendarSlice'


function LocationBtn() {
    const dispatch = useDispatch()
    const location = useSelector(state => state.calendar.currentLocation)

    const handleChange = (event, newLocation) => {
        if (newLocation !== null) {
          dispatch(setCurrentLocation(newLocation))
        }
    };
  
    return (
      <ToggleButtonGroup
        color="primary"
        sx={{'padding': '1em'}}
        value={location}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="all">All locations</ToggleButton>
        <ToggleButton value="loc1">Location 1</ToggleButton>
        <ToggleButton value="loc2">Location 2</ToggleButton>
      </ToggleButtonGroup>
    )
}

export default LocationBtn