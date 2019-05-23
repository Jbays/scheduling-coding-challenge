const _ = require('lodash');
const dateFns = require('date-fns');

//times when the room is booked
let mockAppointments = [
  //room 1 booked at 06/20/49972 @ 4:00pm (UTC). 1 hour booking.
  { "AptNum": 1, "Op": 1, "Duration": 3600000, "AptDateTime": 1514811600000},
  //room 2 booked at 06/20/49972 @ 4:00pm (UTC)
  { "AptNum": 2, "Op": 2, "Duration": 3600000, "AptDateTime": 1514811600000},
  //room 1 booked at 08/01/49972 @ 8:00am (UTC)
  { "AptNum": 3, "Op": 1, "Duration": 3600000, "AptDateTime": 1514815200000},
  //room 2 booked at 08/01/49972 @ 8:00am (UTC)
  { "AptNum": 4, "Op": 2, "Duration": 3600000, "AptDateTime": 1514815200000},
  //room 2 booked at 09/12/49972 @ 12:00am (UTC). 30 minute booking
  { "AptNum": 5, "Op": 2, "Duration": 1800000, "AptDateTime": 1514818800000}
];

//rooms at the dentist office
let mockOperatories = [
  { "OperatoryNum": 1, "ProvNum": 1, "ProvName": "Bill Hader" },
  { "OperatoryNum": 2, "ProvNum": 2, "ProvName": "Willem Dafoe" }
];

let mockSchedules = [
  //07/23/49971 @ 8:00am (UTC) til 12pm (UTC)
  { "ScheduleNum": 1, "ProvNum": 1, "SchedDate": 1514782800000, "StartTime": 28800000, "StopTime": 43200000 },
  { "ScheduleNum": 2, "ProvNum": 2, "SchedDate": 1514782800000, "StartTime": 28800000, "StopTime": 43200000 }
];

function findTimes(appointments,operatories,schedules){
  // console.log(appointments)
  let mockOutAllDentistsWTheirOperatories = genDentistsOperatoriesObj(operatories);
  // console.log(mockOutAllDentistsWTheirOperatories);
  let allPossibleScheduleSlots = genAllScheduleSlots(schedules,mockOutAllDentistsWTheirOperatories,operatories);
  let allAppointments = genAllAppointmentSlots(appointments,operatories);
  
  // console.log(allPossibleScheduleSlots);
  console.log(JSON.stringify(allPossibleScheduleSlots));
}

function genAllAppointmentSlots(allAppointments,allOperatories){
  let allAppointmentsScheduled = {};
  
  for ( let i = 0; i < allAppointments.length; i++ ) {
    let dateOfAppointment = dateFns.format(
      new Date(allAppointments[i].AptDateTime),
      'DD/MM/YYYY--HH:MM:ss'
    )
    let numberOfThirtyMinSlots = (allAppointments[i].Duration/(3600*1000))*2

    // console.log('allAppointments[i]',allAppointments[i]);
    // console.log('dateOfAppointment',dateOfAppointment);
    // console.log('numberOfThirtyMinSlots',numberOfThirtyMinSlots);

    if ( !allAppointmentsScheduled.hasOwnProperty(dateOfAppointment) ){
      allAppointmentsScheduled[dateOfAppointment] = {};
    }

    console.log(allOperatories)
    for ( let j = 0; j < numberOfThirtyMinSlots; j++ ) {
      allAppointmentsScheduled[dateOfAppointment] = {}
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

    //now do this for two more days of availability
    for ( let j = 1; j < 3; j++ ) {
      console.log('this is j',j);
      console.log('array[i].SchedDate',array[i].SchedDate)
      let newDate = `${j}/1/2019`;

      var result = dateFns.addDays(new Date(2014, 8, 1), 1)
      console.log('result',result);
      console.log('newDate',newDate);

      //if newDate is NOT present in allPossibleSlotsForAllDentists
        //write it to the object 
        //then make a copy of what's already present in the previous array
        

    }

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
