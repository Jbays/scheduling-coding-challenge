const expect = require('chai').expect;
const { mockSchedules, mockOperatories, genSchedObject } = require('../orthly-2');

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
  xdescribe('genSchedObjectSkeleton',()=>{
    let providerNumbersFiledByDate
    describe('should output an object whose',()=>{
      it('root keys are date-string objects in DD/MM/YYYY format',()=>{
        
      })
      it('children keys are provider numbers',()=>{

      })
    })
  })
});