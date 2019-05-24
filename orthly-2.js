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

/*
  name: findTimes
  descr: 
  param1: 
  param2: 
  param3: 
  returns:  
*/

function findTimes(appointments,operatories,schedules){
  let allSchedulesObj = genSchedObject(schedules,operatories);
  let allAppointmentsObj = genApptObject(appointments,operatories);

  //small hack here to modify allSchedulesObj -- remove once the prompt is clarified
  // let modifiedAllSchedObj = hackAllSchedObj(allSchedulesObj);

  // let allAvailableTimeSlots = filterSchedAndApptObjs(allSchedulesObj,allAppointmentsObj);
  
  console.log('allSchedulesObj',JSON.stringify(allSchedulesObj));
  console.log('allAppointmentsObj',JSON.stringify(allAppointmentsObj));

  return //unixifyRemainingTimeSlots(allAvailableTimeSlots)
}

/*
  name: genApptObject
  descr: generates the allAppointmentsObj
  param: array of appointment objects
  param: array of operatory objects
  returns: object (root keys are DD/MM/YYYY objects. child keys are provNum objects.
    grandchildKeys are operatoryNum arrays w/elements representing UNAVAILABLE timeslots)
*/

function genApptObject(allAppointments,allOperatories){
  let everyReservedTimeSlotForAllDentists = {};

  for ( let i = 0; i < allAppointments.length; i++ ) {
    let convertedDate = dateFns.format(
      new Date(allAppointments[i].AptDateTime),
      'DD/MM/YYYY-HH:MM'
    )
    let ddMMYYYY = convertedDate.split('-')[0];

    //first add `dd/MM/YYYY` keys to output obj
    if ( !everyReservedTimeSlotForAllDentists.hasOwnProperty(ddMMYYYY) ) {
      everyReservedTimeSlotForAllDentists[ddMMYYYY] = {};
    }

    let currOperatoryNum = allAppointments[i].Op;

    //second add `providerNumber` keys to `dd/MM/YYYY` object
    for ( let j = 0; j < allOperatories.length; j++ ) {
      if ( allOperatories[j].OperatoryNum === currOperatoryNum ){
        let providerNumber = allOperatories[j].ProvNum;
        if ( !everyReservedTimeSlotForAllDentists[ddMMYYYY].hasOwnProperty([providerNumber]) ){
          everyReservedTimeSlotForAllDentists[ddMMYYYY][providerNumber] = {};
        }
        //mock out the array to hold anti-timeSlots
        if ( !everyReservedTimeSlotForAllDentists[ddMMYYYY][providerNumber].hasOwnProperty(currOperatoryNum) ) {
          everyReservedTimeSlotForAllDentists[ddMMYYYY][providerNumber][currOperatoryNum] = [];
        }

        let appointmentStart = convertedDate.split('-')[1];

        //sanitizing the appointmentStart
        if ( appointmentStart[appointmentStart.length-1] === '1' ) {
          appointmentStart = `${appointmentStart.slice(0,-1)}0`
        }

        let hours = Number(appointmentStart.split(':')[0]);

        //calculate how many anti-timeSlots I need to make
        let numOfThirtyMinSlots = allAppointments[i].Duration/(3600*1000)*2
        
        //now make the anti-timeSlots
        for ( let k = 0; k < numOfThirtyMinSlots; k++ ) {
          let hourShift = Math.floor(k*.5);
          let minShift = (k % 2 === 0 ) ? '00' : '30';
          let onePossibleTimeSlot = `${hours+hourShift}:${minShift}`;
          
          everyReservedTimeSlotForAllDentists[ddMMYYYY][providerNumber][currOperatoryNum].push(onePossibleTimeSlot)
        }
      }
    }
  }
  return everyReservedTimeSlotForAllDentists;
}

/*
  name: genSchedObject
  descr: generates the allScheduleObj
  param: array of schedule objects
  param: array of operatory objects
  returns:  object (root keys are DD/MM/YYYY objects. child keys are provNum objects.  
    grandchildKeys are operatoryNum arrays w/elements representing available timeslots)
*/
function genSchedObject(allDentistAvailability,allOperatoriesOperating){
  let everyTimeSlotForAllDentists = {};

  for ( let i = 0; i < allDentistAvailability.length; i++ ) {
    let providerNumber = allDentistAvailability[i].ProvNum;
    let ddMMYYYY = dateFns.format(
      new Date(allDentistAvailability[i].SchedDate),
      'DD/MM/YYYY'
    )

    //first add `dd/MM/YYYY` keys to output obj
    if ( !everyTimeSlotForAllDentists.hasOwnProperty(ddMMYYYY) ){
      everyTimeSlotForAllDentists[ddMMYYYY] = {};
    }
    
    //next add `providerNumber` keys to that `dd/MM/YYYY` key
    if ( !everyTimeSlotForAllDentists[ddMMYYYY].hasOwnProperty(providerNumber) ){
      everyTimeSlotForAllDentists[ddMMYYYY][providerNumber] = {};
    }

    //start generating timeslots
    let startAvailability = allDentistAvailability[i].StartTime/(3600*1000);
    let stopAvailability = allDentistAvailability[i].StopTime/(3600*1000);
    
    let numberOfSlotsPossible = (stopAvailability-startAvailability)*2;
    
    for ( let j = 0; j < allOperatoriesOperating.length; j++ ) {
      let operatoryNumber = allOperatoriesOperating[j].OperatoryNum;
      
      if ( allOperatoriesOperating[j].ProvNum === providerNumber ) {
        if ( !everyTimeSlotForAllDentists[ddMMYYYY][providerNumber].hasOwnProperty(operatoryNumber) ) {
          everyTimeSlotForAllDentists[ddMMYYYY][providerNumber][operatoryNumber] = [];
        }
        
        for ( let k = 0; k < numberOfSlotsPossible; k++ ) {
          let hourShift = Math.floor(k*.5);
          let minShift = (k % 2 === 0 ) ? '00' : '30';
          let onePossibleTimeSlot = `${startAvailability+hourShift}:${minShift}`;
    
          everyTimeSlotForAllDentists[ddMMYYYY][providerNumber][operatoryNumber].push(onePossibleTimeSlot);
        }
      }
    }

  }
  return everyTimeSlotForAllDentists
}

console.log(findTimes(mockAppointments,mockOperatories,mockSchedules))

//expected output is array 
// 1 jan 2018 9am
// [ 1514818800000,
// 1 jan 2018 9:30am
//   1514820600000,
// 1 jan 2018 10:00am
//   1514822400000,
// 1 jan 2018 10:30am
//   1514824200000]

module.exports = {
  genSchedObject,
  findTimes,
  mockAppointments,
  mockOperatories,
  mockSchedules
}