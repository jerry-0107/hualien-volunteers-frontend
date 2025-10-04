import React, { useEffect, useState } from "react";
import { Container, Box, Button, ThemeProvider, CssBaseline } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequestCard from "./components/RequestCard";
import Pagination from "./components/Pagination";
import Toast from "./components/Toast";

// dialogs
import CreateDialog from "./components/dialogs/CreateDialog";
import EditDialog from "./components/dialogs/EditDialog";
import DeliveryDialog from "./components/dialogs/DeliveryDialog";

import { safeApiRequest } from "./utils/helpers";
import isCompleted from "./utils/isCompleted";
import theme from "./colorPalatte";

export default function App() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [toastMsg, setToastMsg] = useState("");

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelivery, setOpenDelivery] = useState(false);
  const [totalPage, setTotalPage] = useState(2);

  const [editData, setEditData] = useState();
  const [deliveryData, setDeliveryData] = useState();

  const [requestState, setRequestState] = useState('active')

  useEffect(() => {
    loadData(page, requestState, true);
  }, [page, requestState]);

  const loadData = async (offset, state, shouldScrollThePage) => {
    const result = await safeApiRequest(
      `https://guangfu250923.pttapp.cc/human_resources?limit=20&offset=${offset * 20}&status=${state}`
    );
    if (result.success) {
      //擋掉soft deleted 的資料:  {status:"need_delete"}
      const requests = result.data.member.filter(d => d.status !== "need_delete");

      //依據完成與否進行排序
      const sortedRequests = [...requests].sort((a, b) => {
        const aCompleted = isCompleted(a);
        const bCompleted = isCompleted(b);
        if (aCompleted && !bCompleted) return 1;
        if (!aCompleted && bCompleted) return -1;
        return 0;
      });

      setRequests(sortedRequests)

      setTotalPage((result.data.totalItems % 20 === 0) ? (result.data.totalItems / 20) : Math.floor(result.data.totalItems / 20) + 1)

      if (shouldScrollThePage) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };


  function EditRequest(data) {
    setEditData(data)
    setOpenEdit(true)
  }


  function DeliveryRequest(data) {
    setDeliveryData(data)
    setOpenDelivery(true)
  }

  function onEditSubmittedCallback(isSuccess) {
    if (isSuccess) {
      setToastMsg("需求更新成功!");
      setOpenEdit(false);
      loadData(page, requestState, false);
    } else {
      setToastMsg("需求更新失敗，請再試一次!");
    }
  }

  function onDeliverySubmittedCallback(isSuccess) {
    if (isSuccess) {
      setToastMsg("加入成功!");
      setOpenDelivery(false);
      loadData(page, requestState, false);
    } else {
      setToastMsg("加入失敗，請再試一次!");
    }
  }
  function onCreateSubmittedCallback(isSuccess) {
    if (isSuccess) {
      setToastMsg("需求已送出!");
      setOpenCreate(false);
      loadData(page, requestState, false);
    } else {
      setToastMsg("需求送出失敗，請再試一次!");
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header onCreate={() => setOpenCreate(true)} />
        <Container sx={{ mt: 3 }}>
          <Box sx={{ width: '100%', mb: 1 }}>
            <Tabs
              value={requestState}
              onChange={(e, v) => { setRequestState(v); setPage(0) }}
            >
              <Tab value="active" label="尚缺志工" />
              <Tab value="completed" label="已完成" />
            </Tabs>
          </Box>
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onEdit={(data) => EditRequest(data)}
              onDelivery={(data) => DeliveryRequest(data)}
            />
          ))}

          <Pagination page={page + 1} onPageChange={setPage} count={totalPage} />

          <Box sx={{ mt: 3 }}>
            <Footer />
          </Box>
        </Container>


        <CreateDialog open={openCreate} onSubmittedCallback={onCreateSubmittedCallback} onClose={() => setOpenCreate(false)} />
        <EditDialog open={openEdit} onSubmittedCallback={onEditSubmittedCallback} request={editData} onClose={() => setOpenEdit(false)} />
        <DeliveryDialog open={openDelivery} onSubmittedCallback={onDeliverySubmittedCallback} onClose={() => setOpenDelivery(false)} request={deliveryData} />


        <Toast message={toastMsg} onClose={() => setToastMsg("")} />
      </ThemeProvider>
    </>
  );
}
