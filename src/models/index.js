// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Link } = initSchema(schema);

export {
  Link
};