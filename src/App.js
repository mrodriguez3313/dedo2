// Import react components
import { useState, useEffect } from 'react';

// Import App Component & helper
import WorkshopForm from './components/Form';

// Import UI Components
import { Header, Tab, Container } from 'semantic-ui-react';

/************************************************/
/*        Step 4.2 Code goes here               */
/************************************************/
import { ContentRecordDAC } from '@skynetlabs/content-record-library';
import { FeedDAC } from "feed-dac-library";

/*****/

/************************************************/
/*        Step 1.2 Code goes here               */
/************************************************/
// Import the SkynetClient and a helper
import { SkynetClient } from 'skynet-js';

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal = 'https://siasky.net/';

// Initiate the SkynetClient
const client = new SkynetClient(portal);
/*****/

/************************************************/
/*        Step 4.3 Code goes here               */
/************************************************/
const contentRecord = new ContentRecordDAC();
// const feedDAC = new FeedDAC();
/*****/

function App() {
  // Define app state helpers
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Step 1 Helpers
  const [file, setFile] = useState();
  const [fileSkylink, setFileSkylink] = useState('');

  // Step 2 Helpers
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Step 3 Helpers
  const [dataKey, setDataKey] = useState('dedo_videos');
  const [filePath, setFilePath] = useState();
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);

  // When dataKey changes, update FilePath state.
  useEffect(() => {
    setFilePath(dataDomain + '/' + dataKey);
  }, [dataKey]);

  /************************************************/
  /*        Step 3.1 Code goes here               */
  /************************************************/

  // choose a data domain for saving files in MySky
  const dataDomain = 'localhost';

  /*****/

  // On initial run, start initialization of MySky
  useEffect(() => {
    /************************************************/
    /*        Step 3.2 Code goes here               */
    /************************************************/
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain, {debug: true, dev:true});

        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();
    /*****/
  }, []);

  // Handle form submission. To submit new videos.
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('form submitted');
    setLoading(true);

    /************************************************/
    /*        Part 1: Upload a file                */
    /************************************************/
    console.log('Uploading file...');

    /************************************************/
    /*        Step 1.3 Code goes here               */
    /************************************************/

    // const res = feedDAC.createPost({
    //   video: file,
    // });
    // if (res.success){
    //   console.log(`Reference to the new video: ${res.ref}`);
    // } else {
    //   alert(`Error in submit: ${res.error}`);
    // }


    // Upload user's file and get backs descriptor for our Skyfile
    const { skylink } = await client.uploadFile(file);

    // skylinks start with 'sia://' and don't specify a portal URL
    // we can generate URLs for our current portal though.
    const skylinkUrl = await client.getSkylinkUrl(skylink);

    console.log('File Uploaded:', skylinkUrl);

    // To use this later in our React app, save the URL to the state.
    setFileSkylink(skylinkUrl);

    /************************************************/
    /*        Part 3: MySky                         */
    /************************************************/
    console.log('Saving user data to MySky file...');

    /************************************************/
    /*        Step 3.6 Code goes here              */
    /************************************************/
    // create JSON data pertaining to file submitted to write to MySky
    // the file will automatically be attached to userID
    const jsonData = {
      name,
      description,
    };

    // call helper function for MySky Write
    await handleMySkyWrite(jsonData);
  };

  const handleMySkyLogin = async () => {
    /************************************************/
    /*        Step 3.3 Code goes here               */
    /************************************************/
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
    /*****/
  };

  const handleMySkyLogout = async () => {
    /************************************************/
    /*        Step 3.4 Code goes here              */
    /************************************************/
    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID('');
    /*****/
  };

  const handleMySkyWrite = async (jsonData) => {
    /************************************************/
    /*        Step 3.7 Code goes here               */
    /************************************************/
    // Use setJSON to save the user's information to MySky file
    try {
      console.log('userID', userID);
      console.log('filePath', filePath);
      await contentRecord.recordNewContent({ fileSkylink , metadata: {"ts":"", "fs": "3", "ft": "mp4", "ot": "Will make object later", "l": 0, "rp": 0}});
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }
    setLoading(false);

  };

  // loadData will load the users data from SkyDB
  const loadData = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Loading user data from SkyDB');

    /************************************************/
    /*        Step 4.5 Code goes here              */
    /************************************************/
    // Use getJSON to load the user's information from SkyDB
    const { data } = await mySky.getJSON(filePath);
    console.log(data)
    // To use this elsewhere in our React app, save the data to the state.
    if (data) {
      setName(data.name);
      setDescription(data.description);
      setFileSkylink(data.skylinkUrl);
      console.log('User data loaded from SkyDB!');
    } else {
      console.error('There was a problem with getJSON');
    }
    /*****/

    setLoading(false);
  };

  const handleSaveAndRecord = async (event) => {
    event.preventDefault();
    setLoading(true);

    /************************************************/
    /*        Step 4.6 Code goes here              */
    /************************************************/
    console.log('Saving user data to MySky');

    const jsonData = {
      name,
      description,
      skylinkUrl: fileSkylink,
    };

    try {
      // write data with MySky
      await mySky.setJSON(filePath, jsonData);

      // Tell contentRecord we updated the color
      await contentRecord.recordInteraction({
        skylink: fileSkylink,
        metadata: { action: 'updatedDescriptionOf' },
      });
    } catch (error) {
      setLoading(false);
      console.log(`error with setJSON: ${error.message}`);
    }
    /*****/

    setLoading(false);
  };

  // define args passed to form
  const formProps = {
    mySky,
    handleSubmit,
    handleMySkyLogin,
    handleMySkyLogout,
    handleSaveAndRecord,
    loadData,
    name,
    description,
    dataKey,
    activeTab,
    fileSkylink,
    loading,
    loggedIn,
    dataDomain,
    userID,
    setLoggedIn,
    setDataKey,
    setFile,
    setName,
    setDescription,
  };

  // handleSelectTab handles selecting the part of the workshop
  const handleSelectTab = (e, { activeIndex }) => {
    setActiveTab(activeIndex);
  };

  const panes = [
    {
      menuItem: 'Add videos',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Your videos',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
    // {
    //   menuItem: 'Part 3: MySky',
    //   render: () => (
    //     <Tab.Pane>
    //       <WorkshopForm {...formProps} />
    //     </Tab.Pane>
    //   ),
    // },
    // {
    //   menuItem: 'Part 4: Content Record DAC',
    //   render: () => (
    //     <Tab.Pane>
    //       <WorkshopForm {...formProps} />
    //     </Tab.Pane>
    //   ),
    // },
  ];

  return (
    <Container>
      <Header
        as="h1"
        content="Dedo"
        textAlign="center"
        style={{ marginTop: '1em', marginBottom: '1em' }}
      />
      <Tab
        menu={{ fluid: true, vertical: true, tabular: true }}
        panes={panes}
        onTabChange={handleSelectTab}
        activeIndex={activeTab}
      />
    </Container>
  );
}

export default App;
