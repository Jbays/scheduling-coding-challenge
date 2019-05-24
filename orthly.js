const _ = require('lodash');
const dateFns = require('date-fns');

//times when the room is booked
let mockAppointments = [
  //room 1 booked at 1/1/2018 @ 4:00pm (UTC). 1 hour booking.
  { "AptNum": 1, "Op": 1, "Duration": 3600000, "AptDateTime": 1514811600000},
  //room 2 booked at 1/1/2018 @ 4:00pm (UTC)
  { "AptNum": 2, "Op": 2, "Duration": 3600000, "AptDateTime": 1514811600000},
  //room 1 booked at 1/1/2018 @ 8:00am (UTC)
  { "AptNum": 3, "Op": 1, "Duration": 3600000, "AptDateTime": 1514815200000},
  //room 2 booked at 1/1/2018 @ 8:00am (UTC)
  { "AptNum": 4, "Op": 2, "Duration": 3600000, "AptDateTime": 1514815200000},
  //room 2 booked at 1/1/2018 @ 12:00am (UTC). 30 minute booking
  { "AptNum": 5, "Op": 2, "Duration": 1800000, "AptDateTime": 1514818800000}
];

//rooms at the dentist office
let mockOperatories = [
  { "OperatoryNum": 1, "ProvNum": 1, "ProvName": "Bill Hader" },
  { "OperatoryNum": 2, "ProvNum": 2, "ProvName": "Willem Dafoe" }
];

let mockSchedules = [
  //31/12/2017 @ 8:00am (UTC) til 12pm (UTC)
  { "ScheduleNum": 1, "ProvNum": 1, "SchedDate": 1514782800000, "StartTime": 28800000, "StopTime": 43200000 },
  { "ScheduleNum": 2, "ProvNum": 2, "SchedDate": 1514782800000, "StartTime": 28800000, "StopTime": 43200000 }
];

function findTimes(appointments,operatories,schedules){
  let mockOutAllDentistsWTheirOperatories = genDentistsOperatoriesObj(operatories);
  let allPossibleScheduleSlots = genAllScheduleSlots(schedules,mockOutAllDentistsWTheirOperatories,operatories);
  let allAppointments = genAllAppointmentSlots(appointments,operatories);
  
  console.log(allAppointments);
  console.log(JSON.stringify(allPossibleScheduleSlots));

  let output = filterOutAppointmentsFromAllPossibleSlots(allPossibleScheduleSlots,allAppointments);
  

  //last step is to use _.difference!
    //_.difference([2, 1], [2, 3]);
    // => [1]
}

function filterOutAppointmentsFromAllPossibleSlots(everyScheduleSlot,everyAppointment){
  console.log(everyScheduleSlot)
  console.log(everyAppointment)
}

function genAllAppointmentSlots(allAppointments,allOperatories){
  let allAppointmentsScheduled = {};
  
  for ( let i = 0; i < allAppointments.length; i++ ) {
    let fullDateOfAppointment = dateFns.format(
      new Date(allAppointments[i].AptDateTime),
      'DD/MM/YYYY--HH:MM:ss'
    )
    let dayMonthYearOfAppt = fullDateOfAppointment.split('--')[0];
    let timeOfAppointment = fullDateOfAppointment.split('--')[1];
    
    //small step to clean up the times
    let timeOfAppointmentArr = timeOfAppointment.split(':')

    if ( timeOfAppointmentArr[1][1] === '1' ){
      timeOfAppointment = `${timeOfAppointmentArr[0]}:00`
    }

    if ( !allAppointmentsScheduled.hasOwnProperty(dayMonthYearOfAppt) ){
      allAppointmentsScheduled[dayMonthYearOfAppt] = {};
    }
    
    let numberOfThirtyMinSlots = (allAppointments[i].Duration/(3600*1000))*2

    for ( let j = 0; j < numberOfThirtyMinSlots; j++ ) {
      if ( !allAppointmentsScheduled[dayMonthYearOfAppt].hasOwnProperty(allAppointments[i].Op) ){
        allAppointmentsScheduled[dayMonthYearOfAppt][allAppointments[i].Op] = [];
      }

      let minShift = ( j % 2 === 0 ) ? '00' : '30';
      let reservedTimeSlot = `${timeOfAppointment.split(':')[0]}:${minShift}`

      allAppointmentsScheduled[dayMonthYearOfAppt][allAppointments[i].Op].push(reservedTimeSlot);
    }
    
  }

  return allAppointmentsScheduled
}

//outputs an object whose first set of keys is the date
  //each date key has a provider number key whose val is an obj
    //each provider number obj has a key corresponding to Operatory Number (whose val is an array)
      //and each Operatory Number array has elements representing each possible 30 minute slot
function genAllScheduleSlots(array,object,allOperatories){
  let allPossibleSchedulesSlotsForAllDentists = {}
  // console.log('array',array);

  for ( let i = 0; i < array.length; i++ ) {
    let dateAvailable = dateFns.format(
      new Date(array[i].SchedDate),
      'DD/MM/YYYY'
    )
    //mock out the object as necessary
    if ( !allPossibleSchedulesSlotsForAllDentists.hasOwnProperty(dateAvailable) ){
      allPossibleSchedulesSlotsForAllDentists[dateAvailable] = {}
    }
    
    for ( let providerNumObj in object ) {
      if ( !allPossibleSchedulesSlotsForAllDentists[dateAvailable].hasOwnProperty(providerNumObj) ) {
        allPossibleSchedulesSlotsForAllDentists[dateAvailable][providerNumObj] = {};
      }
      
      for ( let operatoryNumberArr in object[providerNumObj] ) {
        if ( !allPossibleSchedulesSlotsForAllDentists[dateAvailable][providerNumObj].hasOwnProperty(operatoryNumberArr) ) {
          allPossibleSchedulesSlotsForAllDentists[dateAvailable][providerNumObj][operatoryNumberArr] = [];
        }
      }
    }

    let startAvailability = array[i].StartTime/(3600*1000);
    let stopAvailability = array[i].StopTime/(3600*1000);
    let numberOfSlotsAvailable = (stopAvailability-startAvailability)*2;

    for ( let j = 0; j < numberOfSlotsAvailable; j++ ) {
      let hourShift = Math.floor(j*.5)
      let minShift = (j % 2 === 0 ) ? '00' : '30';
      let timeSlotIsAvailable = `${startAvailability+hourShift}:${minShift}`

      //HACK -- how do I link operatories?
      let correctOperatory = allOperatories[array[i].ScheduleNum-1].OperatoryNum

      allPossibleSchedulesSlotsForAllDentists[dateAvailable][array[i].ProvNum][correctOperatory].push(timeSlotIsAvailable);
    }

    /*

    For now I'll comment out this code

    //now do this for two more days of availability
    //hack!
    for ( let j = 1; j < 3; j++ ) {
      let newDate = `${j}/1/2018`;

      if ( !allPossibleSchedulesSlotsForAllDentists.hasOwnProperty(newDate) ) {
        allPossibleSchedulesSlotsForAllDentists[newDate] = {};
      }

      if ( !allPossibleSchedulesSlotsForAllDentists[newDate].hasOwnProperty(array[i].ProvNum) ){
        allPossibleSchedulesSlotsForAllDentists[newDate][array[i].ProvNum] = _.extend(allPossibleSchedulesSlotsForAllDentists[newDate][array[i].ProvNum], allPossibleSchedulesSlotsForAllDentists[dateAvailable][array[i].ProvNum])
      }
    }
    */
  }

  return allPossibleSchedulesSlotsForAllDentists;
}

//outputs an object whose first set of keys are the dentist's provider number
  //each dentist's provider number has keys equal to their 
function genDentistsOperatoriesObj(array){
  let allDentistsWithEachOfTheirOperatories = {};
  
  for ( let i = 0; i < array.length; i++ ) {
    //if ProvNum has no entry
    if ( !allDentistsWithEachOfTheirOperatories.hasOwnProperty(array[i].ProvNum) ){
      allDentistsWithEachOfTheirOperatories[array[i].ProvNum] = {};
    } 

    //if ProvNum has key corresponding to their assigned OperatoryNumber
    if (!allDentistsWithEachOfTheirOperatories[array[i].ProvNum].hasOwnProperty(array[i].OperatoryNum) ){
      allDentistsWithEachOfTheirOperatories[array[i].ProvNum][array[i].OperatoryNum] = [];
    }
  }

  return allDentistsWithEachOfTheirOperatories
}


console.log(findTimes(mockAppointments,mockOperatories,mockSchedules))
