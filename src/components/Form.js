import { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Header,
  Image,
  Loader,
  Dimmer,
  Segment,
  Divider,
  Label,
} from 'semantic-ui-react';
import Links from './Links';
import FileDrop from './Filedrop';

// WorkshopForm is a simple form used for the Skynet Workshop
const WorkshopForm = (props) => {
  const [uploadPreview, setUploadPreview] = useState(props.fileSkylink);

  useEffect(() => {
    setUploadPreview(props.fileSkylink);
  }, [props.fileSkylink]);

  return (
    <>
      <Segment>
        <Dimmer active={props.loading}>
          <Loader active={props.loading} />
        </Dimmer>
          <>
            {props.loggedIn === true && (
              <Button onClick={props.handleMySkyLogout}>
                Log Out of MySky
              </Button>
            )}
            {props.loggedIn === false && (
              <Button color="green" onClick={props.handleMySkyLogin}>
                Login with MySky
              </Button>
            )}
            {props.loggedIn === null && <Button>Loading MySky...</Button>}
              <Label pointing="left" color="green" basic>
                Once logged into MySky, we can save and load data in "files".
              </Label>
            <Divider />
          </>
        {/* This is Part 4 tab */}
        <Form onSubmit={props.handleSubmit}>
           {props.activeTab === 1 && (
            <>
              <Header as="h4">MySky File Data</Header>
              <Form.Field>
                <label>
                  Discoverable UserID <i>(Shared across MySky)</i>
                </label>
                <Input
                  placeholder="You must Login with MySky..."
                  value={props.userID}
                  icon="user circle"
                  iconPosition="left"
                />
              </Form.Field>
              <Form.Group>
                <Form.Field>
                  <label>File Path</label>
                  <Input
                    label={props.dataDomain + '/'}
                    placeholder="dedo_videos"
                    value={props.dataKey}
                    // onChange={(e) => {
                    //   props.setDataKey(e.target.value);
                    // }}
                  />
                    {/* <Label pointing basic color="green">
                      MySky Files are saved at a path. An app must have
                      permissions to write there.
                    </Label> */}
                  
                </Form.Field>
              </Form.Group>
              {/* <Divider /> */}
            </>
           )}
          {/* Input for name, This and down is Part 2*/}
           {props.activeTab === 0 && (
            <>
              <Header as="h4">Input for Video</Header>
              <Form.Group>
                <Form.Input
                  label="Name"
                  placeholder="Video Name"
                  value={props.name}
                  onChange={(e) => {
                    props.setName(e.target.value);
                  }}
                />
              </Form.Group>
              <Header as="h5">Video Description</Header>
              <Form.Group>
                <Form.Input
                  label="Description"
                  placeholder="Enter video description"
                  value={props.description}
                  onChange={(e) => {
                    props.setDescription(e.target.value);
                  }}
                />
              </Form.Group>
          {/* Input for file This is Part 1 */}
          <Header as="h4">Video Upload</Header>
          <Form.Group inline>
            <Form.Field>
              <FileDrop
                setFile={props.setFile}
                setUploadPreview={setUploadPreview}
              />
            </Form.Field>
            <Image src={uploadPreview} size="small" />
          </Form.Group>
            <Label pointing basic color="green">
              After uploading to Skynet, an immutable Skylink is returned!
            </Label>
            </>
          )}
            <Divider />
            
            <Form.Group>
              {props.activeTab === 0 && (
                <Button primary disabled={!uploadPreview} 
                  type="submit"
                  style={{ marginLeft: '10px' }}
                >
                  Send to Skynet
                </Button>
              )}
              {/* This button loads dac objects under certain file path and userID */}
              {props.activeTab === 1 && (
                <>
                  <Button
                    style={{ marginLeft: '10px' }}
                      variant="success"
                      disabled={props.loggedIn !== true || !props.dataKey}
                      onClick={(e) => {
                        props.loadData(e);
                      }}
                  >
                    Load Data from File
                  </Button>
                  <Links
                    fileSkylink={props.fileSkylink}
                  />
              </>
              )}
              {/* This button is to update info on DAC  */}
              {/* <Button
                    style={{ marginLeft: '20px' }}
                    variant="success"
                    size="medium"
                    disabled={
                      props.loggedIn !== true ||
                      !props.dataKey || !props.description
                    }
                onClick={(e) => {
                  props.handleSaveAndRecord(e);
                }}
              >
                Save Data and Record Update Action
              </Button>
              <Label pointing="left" basic color="green">
                MySky + DAC!
              </Label> */}
          </Form.Group>
        </Form>
      </Segment>
    </>
  );
};

export default WorkshopForm;
