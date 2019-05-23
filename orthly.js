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
  // console.log(operatories)
  // console.log(schedules)
  let mockOutAllDentistsWTheirOperatories = genDentistsOperatoriesObj(operatories);
  let allPossibleScheduleSlots = genAllScheduleSlots(appointments);
  console.log(mockOutAllDentistsWTheirOperatories);
  console.log(allPossibleScheduleSlots);

}

function genAllScheduleSlots(array){
  
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
