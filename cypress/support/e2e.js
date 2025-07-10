import chaiJsonSchema from 'chai-json-schema';
import 'cypress-mochawesome-reporter/register';
import './commands';
chai.use(chaiJsonSchema);
