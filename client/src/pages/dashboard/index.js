import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import withAuth from "@/hoc/withAuth";
import LogoutButton from "@/components/LogoutButton";
import BottomNav from "@/components/BottomNav";
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import styled from 'styled-components';
import axios from "axios";


const StyleWrapperDatePicker = styled.div`
  .ant-picker-panel {
    &:last-child {
      width: 0;
      .ant-picker-header {
        position: absolute;
        right: 0;
        .ant-picker-header-prev-btn, .ant-picker-header-view {
          visibility: hidden;
        }
      }

      .ant-picker-body {
        display: none;
      }

      @media (min-width: 768px) {
        width: 280px!important;
        .ant-picker-header {
          position: relative;
          .ant-picker-header-prev-btn, .ant-picker-header-view {
            visibility: initial;
          }
        }

        .ant-picker-body {
          display: block;
        }
      }
    }
  }
`;

function Dashboard({user}) {

  const [dateRange, setDateRange]=useState([dayjs().subtract(7,'day'), dayjs()])

  const getUpdatedHabits = async()=>{
    const startDate = dateRange[0].format('YYYY-MM-DD')
    const endDate = dateRange[1].format('YYYY-MM-DD')
    console.log(user)
    const response = await axios.get(`http://localhost:5000/api/habit/filtered?startDate=${startDate}&endDate=${endDate}&userId=${user.uid}`)

  }
  useEffect(()=>{
    getUpdatedHabits()
  },[dateRange])
  const panelRender = (panelNode) => (
    <StyleWrapperDatePicker>
      {panelNode}
    </StyleWrapperDatePicker>
  );

  return (
    <div>
      <LogoutButton />
      <div className="text-center mt-16">
        <DatePicker.RangePicker 
        panelRender={panelRender}
        defaultValue={dateRange}
        onChange={(e)=>setDateRange(e)}
        allowClear={false}
        />
      </div>
      <BottomNav/>
    </div>
  );
}

export default withAuth(Dashboard);
