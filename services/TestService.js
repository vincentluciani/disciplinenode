
require('../schema/Test');
const { query } = require('express');

const mongoose = require('mongoose')
const testModel = mongoose.model('test')

const getTest = async (inputObject) => {
  const date = (new Date()).toString();
  
  var test = new testModel({ name: 'Hello World', dateTime: date });

  result = await test.save({ name: 'Hello World', dateTime: date })

  return result

}

module.exports = {
    getTest: getTest
}
