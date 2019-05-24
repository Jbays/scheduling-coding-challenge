const expect = require('chai').expect;
const { mockSchedules, genTimeSlots } = require('../orthly-2');

describe('all functions to complete this coding assessment: \n',()=>{
  describe('genTimeSlots',()=>{
    it('should be a function',()=>{
      expect(genTimeSlots).to.be.a('function');
    });
    it('should generate timeSlots for every dentist in schedules',()=>{
      let allDentists = Object.keys(genTimeSlots(mockSchedules))
      
      expect(allDentists[0]).to.equal('1');
      expect(allDentists[1]).to.equal('2');
      expect(allDentists.length).to.equal(2);
    })
    it('should generate correct amount of timeSlots (given dentist availability)',()=>{
      let allPossibleTimeSlots = genTimeSlots(mockSchedules)
      let dentistOnesTimeSlots = allPossibleTimeSlots[1][1];
      let dentistTwosTimeSlots = allPossibleTimeSlots[2][2];
      
      expect(dentistOnesTimeSlots.length).to.equal(8)
      expect(dentistTwosTimeSlots.length).to.equal(8)
    })
  });
});