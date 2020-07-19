import React, {useEffect, useState} from 'react';
import { Redirect } from "react-router-dom";
import { Formik } from 'formik';

import {
  Box,
  Button,
  Paper,
  TextField,
  Grid
} from '@material-ui/core';

import { DataStore } from '@aws-amplify/datastore';
import { Link } from '../models';

let AddLink = ({urls, updateUrls}) => {
  let [redirect, setRedirect] = useState(false);

  const addLink = async ({key, destination}) => {
    console.log("Adding Link");
    const res = await DataStore.save(
      new Link({key, destination})
    );
    console.log(res);
  };

  if (redirect) return <Redirect to='/' />;

  return (
        <Grid item>
          <Paper className="form-paper">
            <Formik
              initialValues={{ key: '', destination: '' }}
              validate={values => {
                const errors = {};
  
                // Validate key
                if (!values.key) {
                  errors.key = 'Required';
                }
  
                // Validate destination
                if (!values.destination) {
                  errors.destination = 'Required';
                // Ensure url includes protocol and dots
                } else if (!/^https?:\/\/.+\..+$/.test(values.destination)) {
                  errors.destination = 'Not a valid URL';
                }
                return errors;
              }}
              onSubmit={ async (values, { setSubmitting }) => {
                // Publish new entry to DB
                let newUrl = await addLink(values);
                // Add new URL to state
                // console.log(typeof urls);
                // updateUrls([...urls, newUrl]);
                console.log("Flipping redirect");
                setRedirect(true);
                setSubmitting(false);
              //   setAddUrlSection(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    id="key"
                    type="key"
                    name="key"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.key}
                    error={touched.key && errors.key}
                    helperText={touched.key && errors.key}
                    label="URL Key"
                  />

                  <TextField
                    type="destination"
                    name="destination"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.destination}
                    error={touched.destination && errors.destination}
                    helperText={touched.destination && errors.destination}
                    label="Destination"
                  />
                  <Box mt={1}/>
                  <Button type="submit" color="primary" variant="contained" disabled={isSubmitting} >
                    Submit
                  </Button>
                </form>
              )}
            </Formik>
        </Paper>
      </Grid>
  );
};

export default AddLink;