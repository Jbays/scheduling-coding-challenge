const expect = require('chai').expect;
const { mockAppointments, mockSchedules, mockOperatories, 
        genSchedObject, genApptObject } = require('../orthly-2');

describe('all functions to complete this coding assessment: \n',()=>{
  describe('genSchedObject',()=>{
    let allPossibleTimeSlots = genSchedObject(mockSchedules,mockOperatories);
    let availability = allPossibleTimeSlots["31/12/2017"]

    it('should be a function',()=>{
      expect(genSchedObject).to.be.a('function');
    });
    it('should list 2 dentists with availability on 31 december 2017',()=>{
      let numberOfDentistsListed = Object.keys(availability).length;
      expect(numberOfDentistsListed).to.equal(2);
    })
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
    })
  });
  describe('genApptObject',()=>{
    let providerAvailFiledByDate = genApptObject(mockAppointments, mockOperatories);

    describe('should output an object whose',()=>{
      let allDentistsAvailOnDate = providerAvailFiledByDate['01/01/2018'];
      it('root keys are date-string objects in DD/MM/YYYY format',()=>{
        expect(allDentistsAvailOnDate).to.exist;
      })
      it('children keys have provider numbers 1 and 2',()=>{
        let allDentistsAvailable = Object.keys(allDentistsAvailOnDate);
        expect(allDentistsAvailable.includes('1')).to.equal(true)
        expect(allDentistsAvailable.includes('2')).to.equal(true)
      })
      let firstDentistOperatory = allDentistsAvailOnDate['1']['1'];
      let secondDentistOperatory = allDentistsAvailOnDate['2']['2'];
      it('grandchildren keys are operatories objects belonging to providers',()=>{
        expect(typeof firstDentistOperatory).to.equal('object')
        expect(typeof secondDentistOperatory).to.equal('object')
      })
      it('whose grandchildren properties are arrays containing specific values',()=>{
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
      })
    })
  })
});