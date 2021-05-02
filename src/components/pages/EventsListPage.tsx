import React, { useState, useRef, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import MaterialTable from 'material-table';
import GenericTemplate from '../templates/GenericTemplate';
import {
  Event,
  Status
} from '../../../../api/types'
import {getDateWithString} from '../../utils/dateUtils';

type Props = {} & RouteComponentProps<{}>;

const EventListPage: React.FC<Props> = (props) => {

  const [selectedEevents, setSelectedEevents] = useState<any[]>(
      null as any
  )

  const [eventsData, setEeventsData] = useState<any[]>(
    null as any
  )

  useEffect( () => {
    const fetch = async () => {
      // alert('fetch');
      const result = await axios.get("/api/events", {
        params: {
          eventGroupId: 1,
        },
      });
      console.log(result);
      setSelectedEevents(result.data);
    };
    fetch();
  }, []); 

  let events: any[] = [];
  useEffect( () => {
    if (!selectedEevents || !selectedEevents.length) return;
    selectedEevents.forEach((e, index) => {
      events.push(
        {
          id: e.id,
          itemName: e.eventName,
          itemCategory: e["category.name"],
          itemOverview: e.eventOverView,
          scheduledStartDate: getDateWithString(e.scheduledStartDate, "/"),
          expectedDeliveryDate: getDateWithString(e.expectedDeliveryDate, "/"),
          fixedDeliveryDate: getDateWithString(e.fixedDeliveryDate, "/"),
          expectedBillingDate: getDateWithString(e.expectedBillingDate, "/"),
          customerCompany: e.customerCompany,
          customerStaff: e.customerStaff,
          progress: e.progress + "%",
          itemStatus: e["status.name"]
        }
      )
      })      
      // alert(events.length);
      setEeventsData(events);
  }, [selectedEevents]); 


  return (
    <GenericTemplate title={'案件情報一覧ページ'} maxWidth="lg">
      {eventsData && (<MaterialTable
        actions={[
          {
            icon: 'edit',
            tooltip: '案件情報編集',
            onClick: (_, rowData) =>
              props.history.push({ pathname: "/editEvent/" + (rowData as any).id}),
          },
        ]}
        columns={[
          { field: 'id', hidden: true },
          { title: '案件名', field: 'itemName' },
          { title: '案件区分', field: 'itemCategory' },
          { title: '開始予定日', field: 'scheduledStartDate' },
          { title: '納期予定日', field: 'expectedDeliveryDate' },
          { title: '確定納期', field: 'fixedDeliveryDate' },
          { title: '請求予定日', field: 'expectedBillingDate' },
          { title: '顧客会社名', field: 'customerCompany' },
          { title: '顧客担当', field: 'customerStaff' },
          { title: '進捗状況', field: 'progress' },
          { title: '案件ステータス', field: 'itemStatus' },
        ]}
        data={eventsData}
        options={{
          showTitle: false,
        }}
      />)}
    </GenericTemplate>
  );
};

export default withRouter(EventListPage);