import React from 'react';

import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from '@material-ui/core';

import {Link} from "react-router-dom";
import { DataStore } from '@aws-amplify/datastore';


// import { deleteUrl } from '../../graphql/mutations';
// import { listUrls } from '../../graphql/queries';

// import { API, graphqlOperation } from 'aws-amplify';

const deleteUrlButton = async (link) => {
  console.log("Deleting a Link");
  console.log(link);
  DataStore.delete(link);
  // const linkToDelete = await DataStore.query(Link, id);
  // console.log(linkToDelete);
};

// const getMoreResults = () => {};

// const deleteUrlButton = async (id, index, urls, updateUrls) => {
//   try {
//     var response = await API.graphql(graphqlOperation(deleteUrl, {input: {id}} ));
//     if (id == response.data.deleteUrl.id) {
//       // Copy url state to manipulate
//       let tmp_urls = [...urls];
//       // Remove deleted entry from array
//       tmp_urls.splice(index, 1);
//       updateUrls(tmp_urls);
//     }
//   } catch (err) {
//     throw new Error("Failed to delete URL. " + err.message);
//   }
// };

// const getMoreResults = async (urls, nextToken) => {
//   try {
//     // Use next token to get more results
//     var urlData = await API.graphql(graphqlOperation(listUrls, {nextToken}));

//     // Iterate results adding local links
//     urlData.data.listUrls.items.map(url => {
//       url.sitePath = `/r/${url.shortUrl}`;
//       return url;
//     });

//     // Append results to url array
//     let tmpUrls = [...urls, ...urlData.data.listUrls.items];

//     // Extract new next token
//     let tmpNextToken = urlData.data.listUrls.nextToken;

//     return [tmpUrls, tmpNextToken];
//   } catch (err) {
//     console.log('Error getting next urls. ' + err.message);
//   }
// };

let LinkTable = ({links, updateUrls, nextToken, setNextToken}) => {

  let exportLinks = () => {
    console.log("Export");

    // Clean objects before exporting
    let cleanLinks = links.map(link => ({key: link.key, destination: link.destination}))
    const jsonLinks = JSON.stringify(cleanLinks);
    var data = new Blob([jsonLinks], {type: 'text/csv'});
    var csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'CloudBookmarkLinks.json');
    tempLink.click();
  };

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>
                Key
              </TableCell>
              <TableCell>
                Destination
              </TableCell>
              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {
              links.map((link, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link to={`/r/${link.key}`}>{link.key}</Link>
                  </TableCell>
                  <TableCell>
                    {link.destination}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="secondary" onClick={() => {deleteUrlButton(link)}}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            }

          </TableBody>


          <TableFooter>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">
                <Button onClick={exportLinks}>Export</Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  disabled={nextToken===null}
                  onClick={
                    async () => {
                      let [tmpUrls, tmpNextToken] = await getMoreResults(links, nextToken);
                      updateUrls(tmpUrls);
                      setNextToken(tmpNextToken);
                    }
                  }
                >
                    Load More Results
                </Button> */}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default LinkTable;