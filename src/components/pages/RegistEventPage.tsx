import React, { useState, useEffect, useRef } from "react";
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Button, InputLabel, Select, MenuItem, Box, CssBaseline, Container, FormGroup, FormControlLabel, Checkbox, FormLabel } from '@material-ui/core';
import GenericTemplate from "../templates/GenericTemplate";
import {
  Event,
  Status,
  Category,
  Document
} from '../../../../api/types'
import {getDateWithString} from '../../utils/dateUtils';
import {nullTo} from '../../utils/stringUtils';

type Props = {} & RouteComponentProps<{}>;

const RegistEventPage: React.FC<Props> = (props) => {

  const params = useParams<{ id: string }>();

  const [eventId, setEventId] = useState(params.id);

  const [targetEvent, setTargetEvent] = useState<Event>(
    null as any
  );

  const [registValues, setRegistValues] = useState<{[key: string]: any}>(
    null as any
  );

  const [eventStatuses, setEventStatuses] = useState<Status[]>(
    null as any
  );
  const [eventCategories, setEventCategories]= useState<Category[]>(
    null as any
  );
  const [eventDocuments, setEventDocuments]= useState<Document[]>(
    null as any
  );

  const [changeCount, setChangeCount] = useState(0);

  useEffect( () => {
    const statusesFetch = async () => {
      // alert('statusesFetch');
      const result = await axios.get("/api/statuses", {
        params: {
          eventGroupId: 1,
        },
      });
      console.log(result);
      setEventStatuses(result.data);
    };
    statusesFetch();
  
    const categoriesFetch = async () => {
      // alert('categoriesFetch');
      const result = await axios.get("/api/categories", {
        params: {
          eventGroupId: 1,
        },
      });
      console.log(result);
      setEventCategories(result.data);
    };
    categoriesFetch();

    const documentsFetch = async () => {
      // alert('documentsFetch');
      const result = await axios.get("/api/documents", {
      });
      console.log(result);
      setEventDocuments(result.data);
    };
    documentsFetch();
  
    if (!eventId) return;
    // alert(eventId);
    const fetch = async () => {
      // alert('fetch');
      const result = await axios.get("/api/events/" + eventId);
      console.log(result);
      setTargetEvent(result.data);
    };
    fetch();
  }, []); 

  useEffect( () => {
    let values: { [key: string]: any} = {};
    values['eventName'] = targetEvent ? targetEvent.eventName : null; 
    values['eventCategory'] = targetEvent ? targetEvent.eventCategory : null; 
    values['eventOverView'] = targetEvent ? targetEvent.eventOverView : null; 
    values['scheduledStartDate'] = targetEvent ? getDateWithString(targetEvent.scheduledStartDate as unknown as Date, "-") : null as any;
    values['expectedDeliveryDate'] = targetEvent ? getDateWithString(targetEvent.expectedDeliveryDate as unknown as Date, "-") : null as any;
    values['fixedDeliveryDate'] = targetEvent ? getDateWithString(targetEvent.fixedDeliveryDate as unknown as Date, "-") : null as any;
    values['expectedBillingDate'] = targetEvent ? getDateWithString(targetEvent.expectedBillingDate as unknown as Date, "-") : null as any;
    values['customerCompany'] = targetEvent ? targetEvent.customerCompany : null; 
    values['customerStaff'] = targetEvent ? targetEvent.customerStaff : null; 
    values['eventStatus'] = targetEvent ? targetEvent.eventStatus : null; 
    values['progress'] = targetEvent ? targetEvent.progress : null; 
    setRegistValues(values);
  }, [targetEvent]); 

  // const registColumnNames: string[] = ['eventName', 'eventOverView', 'scheduledStartDate',
  // 'expectedDeliveryDate', 'fixedDeliveryDate', 'expectedBillingDate', 'customerCompany',
  // 'customerStaff', 'status'];

  const onClickRegist = () => {
    if (!window.confirm('上記内容で案件情報登録します。よろしいですか？')) {
      return;
    }
    registValues["eventGroupId"] = 1;      
  
    const fetch = async () => {
      let apiPath = '/api/events';
      if (eventId) {
        apiPath += '/' + eventId;
      }
      alert(apiPath);
      await axios.post(apiPath,{
        headers: {
          'content-type': 'application/json',
         },
         body: JSON.stringify(registValues),        
      })
    };

    fetch().then(response => {
     }).then(res => {
      props.history.push({ pathname: "/listEvents" } );
     }).catch(error => {
       console.log(error);
     });
  }

  const onStatusChange = (e: any) => {
    registValues['eventStatus'] = e.target.value;
    setChangeCount(changeCount+1);
  }
  
  const onProgressChange = (e: any) => {
    registValues['progress'] = e.target.value;
    setChangeCount(changeCount+1);
  }
  
  const onCategoryChange = (e: any) => {
    registValues['eventCategory'] = e.target.value;
    setChangeCount(changeCount+1);
  }

  const onChangeData = (e: any) => {
    // alert(e.target.id);
    // alert(e.target.value);
    registValues[e.target.id] = e.target.value;
    setChangeCount(changeCount+1);
  }
  const handleChange = (e: any) => {
    // alert(e.target.id);
    // alert(e.target.value);
     
      // registValues[e.target.id] = e.target.value;
    setChangeCount(changeCount+1);
  }

  return (
    <GenericTemplate title={'案件情報' + (eventId ? '編集' : '登録') + 'ページ'} maxWidth="md">
      <form name="eventForm">
        {registValues && eventStatuses && eventCategories && eventDocuments && <Box textAlign="left">
          <TextField
            label="案件名"
            id="eventName"
            value={nullTo(registValues["eventName"], '')}
            onChange={e => onChangeData(e)}
            variant="outlined"
            size="small"
            style = {{width: 400}} 
            margin="normal" />
          <InputLabel id="label">案件区分</InputLabel>
          <Select labelId="label" id="eventCategory" value={registValues["eventCategory"]} onChange={onCategoryChange}
              >
            {eventCategories.map((category, index) => {
              return <MenuItem value={category.id}>{category.name}</MenuItem>;
            })}
          </Select>
          <TextField
            label="案件概要"
            id="eventOverView"
            value={nullTo(registValues["eventOverView"], '')}
            onChange={e => onChangeData(e)}
            variant="outlined"
            size="small"
            fullWidth
            margin="normal" />
            <Box display="flex" flexDirection="column"  textAlign="left">
              <TextField
                label="開始予定日"
                id="scheduledStartDate"
                type="date"
                value={nullTo(registValues["scheduledStartDate"], '')}
                onChange={e => onChangeData(e)}
                style = {{width: 200}} 
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="納期予定日"
                id="expectedDeliveryDate"
                type="date"
                style = {{width: 200}} 
                value={nullTo(registValues["expectedDeliveryDate"], '')}
                onChange={e => onChangeData(e)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="確定納期"
                id="fixedDeliveryDate"
                type="date"
                style = {{width: 200}} 
                value={nullTo(registValues["fixedDeliveryDate"], '')}
                onChange={e => onChangeData(e)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="請求予定日"
                id="expectedBillingDate"
                type="date"
                style = {{width: 200}} 
                value={nullTo(registValues["expectedBillingDate"], '')}
                onChange={e => onChangeData(e)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="顧客会社名"
                id="customerCompany"
                variant="outlined"
                value={nullTo(registValues["customerCompany"], '')}
                onChange={e => onChangeData(e)}
                size="small"
                style = {{width: 400}} 
                margin="normal" />
              <TextField
                label="顧客担当者"
                id="customerStaff"
                variant="outlined"
                value={nullTo(registValues["customerStaff"], '')}
                onChange={e => onChangeData(e)}
                size="small"
                style = {{width: 200}} 
                margin="normal" />
            </Box>
            <FormLabel component="legend">書類</FormLabel>
            <FormGroup row>
              {eventDocuments.map((doc, index) => {
                return <FormControlLabel
                  control={<Checkbox checked={false} onChange={handleChange} name={doc.name} />}
                  label={doc.dispName}
                />;
               })}
            </FormGroup>

            <InputLabel id="label">案件ステータス</InputLabel>
            <Select labelId="label" id="eventStatus" value={registValues["eventStatus"]} onChange={onStatusChange}
              >
              {eventStatuses.map((status, index) => {
                return <MenuItem value={status.id}>{status.name}</MenuItem>;
              })}
            </Select>
            <InputLabel id="label">進捗状況</InputLabel>
            <Select labelId="label" id="progress" value={registValues["progress"]} onChange={onProgressChange}
              >
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((progress, index) => {
                return <MenuItem value={progress}>{progress}%</MenuItem>;
              })}
            </Select>
            <InputLabel id="dummy" />
            <Button
              id="registButton"
              variant="contained"
              color="primary"
              onClick={onClickRegist}
              >
              {eventId ? '更新' : '登録'}
            </Button>
           </Box>}
        </form>
    </GenericTemplate>
  );
};
export default RegistEventPage;