import * as importTest from './import-test';

const es6Test = "Babel is functioning.";

$(() => {
  console.log(es6Test);
  importTest.importTest();
  console.log('This is an object import: ',importTest.testObject.key);
});
