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
  let modifiedAllSchedObj = hackAllSchedObj(allSchedulesObj);

  // console.log('allSchedulesObj',JSON.stringify(allSchedulesObj));
  // console.log('allAppointmentsObj',JSON.stringify(allAppointmentsObj));
  // console.log('modifiedAllSchedObj',JSON.stringify(modifiedAllSchedObj));

  return filterRemainingSlots(modifiedAllSchedObj,allAppointmentsObj);
}

/*
  name: filterRemainingSlots
  descr: returns all timeslots available for business
  param: object containing all available timeslots in an array
  param: object containing all anti-timeslots in an array
  returns: array of unix timestamps
*/

function filterRemainingSlots(allPossibleSchedules,allAppointments){
  //should be unix timestamps
  let outputArr = [];
  // console.log('JSON.stringify(allPossibleSchedules)',JSON.stringify(allPossibleSchedules),'\n')
  
  for ( let ddMMYYYY in allPossibleSchedules ) {
    //if allPossibleSchedule's date is contained in allAppointment's dates
    //if appointments exist on that day
    if ( allAppointments.hasOwnProperty(ddMMYYYY) ) {
      
      for ( let providerNum in allPossibleSchedules[ddMMYYYY] ){
        //if appointments exist on that day for THAT provider 
        if ( allAppointments[ddMMYYYY].hasOwnProperty(providerNum) ) {

          // console.log('allAppointments[ddMMYYYY][providerNum]',allAppointments[ddMMYYYY][providerNum]);
          
          for ( let operatoryNum in allPossibleSchedules[ddMMYYYY][providerNum] ){
            // console.log('operatoryNum',operatoryNum)
            
            //if that provider at that operatory on that date has appointments
            if ( allAppointments[ddMMYYYY][providerNum][operatoryNum].length > 0 ){
              /*
                31 May 2019 
                Unless I am not converting the dates correctly, here is the scenario.

                

              */
              
              let dayDentOpAvailability = allPossibleSchedules[ddMMYYYY][providerNum][operatoryNum];
              let dayDentOpAppointment = allAppointments[ddMMYYYY][providerNum][operatoryNum];

              //filter out appointments from the available timeslots
              let realLifeAvailableDentistSlots = _.difference(dayDentOpAvailability,dayDentOpAppointment)
              
              availSlotsAsUnixTimeStamps = realLifeAvailableDentistSlots.map((elem)=>{
                let ddMMYYYYArr = ddMMYYYY.split('/'); 
                let elemArr = elem.split(':');

                if ( elemArr[0].length === 1 ) {
                  elemArr[0] = `0${elemArr[0]}`;
                }

                let dateStr = `${ddMMYYYYArr[2]}-${ddMMYYYYArr[1]}-${ddMMYYYYArr[0]}T${elemArr[0]}:${elemArr[1]}:00`;
                let convertedToObj = new Date(dateStr);

                return convertedToObj.getTime();
              });

              outputArr.push(...availSlotsAsUnixTimeStamps);
            }
          }
        }
      }
    }
  }
  return outputArr;
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
        
        //NOTE: right here I should add the 30 min buffer to fulfill a part of the requirements:
        //- The Operatory has no appointments in the 30 minutes following `t`

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
    
    //figure out how many timeslots are required
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

/*
  name: hackAllSchedObj
  descr: Will replace input's first key with '01/01/2019'
  param: allAppointmentsObj (object)
  returns: object (root keys are DD/MM/YYYY objects. child keys are provNum objects.
    grandchildKeys are operatoryNum arrays w/elements representing UNAVAILABLE timeslots)
*/

function hackAllSchedObj(allDatesDentsOpsTimeslots){
  let output = _.extend(allDatesDentsOpsTimeslots,{});

  output["01/01/2018"] = output["31/12/2017"]
  delete output["31/12/2017"];

  return output;
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
  filterRemainingSlots,
  hackAllSchedObj,
  genSchedObject,
  genApptObject,
  findTimes,
  mockAppointments,
  mockOperatories,
  mockSchedules
}