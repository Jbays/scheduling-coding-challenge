const _ = require ('lodash');
const expect = require('chai').expect;
const { mockAppointments, mockSchedules, mockOperatories, 
        hackAllSchedObj, genSchedObject, genApptObject, filterRemainingSlots } = require('../orthly-2');

describe('all functions to complete this coding assessment: \n',()=>{
  let allPossibleTimeSlots = genSchedObject(mockSchedules,mockOperatories);
  let providerAvailFiledByDate = genApptObject(mockAppointments, mockOperatories);

  /* 
    30 may 2019 - note

      The sample data has three inputs.  One is an array called schedules.  
      Schedules contains two objects.  Each object represents a unique dentist's schedule.

      I am unclear on the date listed in the schedule object.
      Does this date mean on that specific day the dentist works?
      Or, starting on this day for the next two weeks, are the dates this dentist works?

      Because I am unsure about date listed's meaning, I wrote a small hack function
      to ensure the allPossibleTimeSlots and providerAvailFiledByDate interact
      w/one another as originally intentioned.
  */
  let modified_For_Test_allDatesDentsOpsTimeslots = hackAllSchedObj(providerAvailFiledByDate);
  let dentistSlotsOpenAsUnixTimestamps = filterRemainingSlots(modified_For_Test_allDatesDentsOpsTimeslots);

  describe('genSchedObject',()=>{
    let availability = allPossibleTimeSlots["31/12/2017"];

    it('should be a function',()=>{
      expect(genSchedObject).to.be.a('function');
    });
    it('should list 2 dentists with availability on 31 december 2017',()=>{
      let numberOfDentistsListed = Object.keys(availability).length;
      expect(numberOfDentistsListed).to.equal(2);
    });
    it('should generate correct amount of timeSlots (given dentist availability)',()=>{
      let dentistOnesTimeSlots = allPossibleTimeSlots["31/12/2017"]["1"]["1"];
      let dentistTwosTimeSlots = allPossibleTimeSlots["31/12/2017"]["2"]["2"];
      
      expect(dentistOnesTimeSlots.length).to.equal(8);
      expect(dentistTwosTimeSlots.length).to.equal(8);
    });
    describe('should output an object whose',()=>{
      it('outermost keys are provider numbers',()=>{
        let hasDentistOne = availability.hasOwnProperty('1');
        let hasDentistTwo = availability.hasOwnProperty('2');
  
        expect(hasDentistOne).to.equal(true);
        expect(hasDentistTwo).to.equal(true);
      });
      it('values are arrays',()=>{
        let hasDentistOne = Array.isArray(availability['1']['1']);
        let hasDentistTwo = Array.isArray(availability['2']['2']);
  
        expect(hasDentistOne).to.equal(true);
        expect(hasDentistTwo).to.equal(true);
      });
    });
  });
  describe('genApptObject',()=>{
    describe('should output an object whose',()=>{
      let allDentistsAvailOnDate = genApptObject(mockAppointments, mockOperatories)['01/01/2018'];
      it('root keys are date-string objects in DD/MM/YYYY format',()=>{
        expect(allDentistsAvailOnDate).to.exist;
      });
      it('children keys have provider numbers 1 and 2',()=>{
        let allDentistsAvailable = Object.keys(allDentistsAvailOnDate);
        expect(allDentistsAvailable.includes('1')).to.equal(true);
        expect(allDentistsAvailable.includes('2')).to.equal(true);
      });
      let firstDentistOperatory = allDentistsAvailOnDate['1']['1'];
      let secondDentistOperatory = allDentistsAvailOnDate['2']['2'];
      it('grandchildren keys are operatories objects belonging to providers',()=>{
        expect(typeof firstDentistOperatory).to.equal('object')
        expect(typeof secondDentistOperatory).to.equal('object')
      });
      it('whose grandchildren properties are arrays containing specific time values',()=>{
        expect(Array.isArray(firstDentistOperatory)).to.equal(true);
        expect(Array.isArray(secondDentistOperatory)).to.equal(true);
        expect(firstDentistOperatory.includes('7:00')).to.equal(true);
        expect(firstDentistOperatory.includes('7:30')).to.equal(true);
        expect(firstDentistOperatory.includes('8:00')).to.equal(true);
        expect(firstDentistOperatory.includes('8:30')).to.equal(true);
        expect(secondDentistOperatory.includes('7:00')).to.equal(true);
        expect(secondDentistOperatory.includes('7:30')).to.equal(true);
        expect(secondDentistOperatory.includes('8:00')).to.equal(true);
        expect(secondDentistOperatory.includes('8:30')).to.equal(true);
        expect(secondDentistOperatory.includes('9:00')).to.equal(true);
      });
    });
  });
  describe('filterRemainingSlots',()=>{
    it('should be a function',()=>{
      expect(filterRemainingSlots).to.be.a('function');
    });

    describe('should output an array',()=>{
      it('that is of "type" array',()=>{
        expect(Array.isArray(dentistSlotsOpenAsUnixTimestamps)).to.equal(true);
      });
      it('whose length is 4',()=>{
        expect(dentistSlotsOpenAsUnixTimestamps.length).to.equal(4);
      });
      it('containing unix timestamps of specific values',()=>{
        expect(dentistSlotsOpenAsUnixTimestamps[0]).to.equal(1514818800000);
        expect(dentistSlotsOpenAsUnixTimestamps[1]).to.equal(1514820600000);
        expect(dentistSlotsOpenAsUnixTimestamps[2]).to.equal(1514822400000);
        expect(dentistSlotsOpenAsUnixTimestamps[3]).to.equal(1514824200000);
      })
    })
  })
});