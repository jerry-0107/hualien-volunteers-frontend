import React, { useState } from "react";
import {
  DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Alert, AlertTitle
} from "@mui/material";
import StyledDialog from "./StyledDialog";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { safeApiRequest } from "../../utils/helpers";

export default function CreateDialog({ open, onClose, onSubmittedCallback = (isSuccess) => { } }) {
  const [form, setForm] = useState({
    org: "",
    phone: "",
    address: "花蓮縣光復鄉",
    assignment_notes: "",
    headcount_need: 1,
    headcount_unit: "人",
    role_name: "",
    role_type: "一般志工"
  });
  const [agreeTerms, setAgreeTerms] = React.useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [displayConfirmDialog, setDisplayConfirmDialog] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  async function onConfirm(newRequest) {
    setIsLoading(true)
    const payload = {
      ...newRequest,
      headcount_need: Number(newRequest.headcount_need),
      status: "active",
      role_status: "pending"
    }
    const result = await safeApiRequest(
      `https://guangfu250923.pttapp.cc/human_resources`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );
    if (result.success) {
      onSubmittedCallback(true)
      setDisplayConfirmDialog(false)
      setIsLoading(false)
      setForm({
        org: "",
        phone: "",
        address: "花蓮縣光復鄉",
        assignment_notes: "",
        headcount_need: 1,
        headcount_unit: "人",
        role_name: "",
        role_type: "一般志工"
      })
    }
    else {
      onSubmittedCallback(false)
      setDisplayConfirmDialog(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <StyledDialog open={open} fullWidth maxWidth="sm" sx={{
        '& .MuiPaper-root': {
          maxHeight: '70%',
          top: '-10%'
        },
      }}>
        <DialogTitle>人力需求</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth required
                  label="單位名稱"
                  placeholder="陳先生"
                  name="org"
                  value={form.org}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth required
                  label="聯絡資訊"
                  placeholder="手機號碼或line id"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  helperText="注意！資訊將會公開在網路上"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth required
                  label="地址"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                // sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth multiline rows={3}
                  label="備註"
                  name="assignment_notes"
                  placeholder="為求志工符合需求，請您詳述待修繕物品、協助細節、集合時間"
                  value={form.assignment_notes}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 6 }}>
                <FormControl required fullWidth>
                  <InputLabel id="role-type-select-label">需求類別</InputLabel>
                  <Select
                    required
                    labelId="role-type-select-label"
                    name="role_type"
                    label="需求類別"
                    value={form.role_type}
                    onChange={handleChange}
                  >

                    <MenuItem value={"一般志工"}>一般志工</MenuItem>
                    <MenuItem value={"清潔/整理"}>清潔/整理</MenuItem>
                    <MenuItem value={"醫療照護"}>醫療照護</MenuItem>
                    <MenuItem value={"後勤支援"}>後勤支援</MenuItem>
                    <MenuItem value={"專業技術"}>專業技術</MenuItem>
                    <MenuItem value={"其他"}>其他</MenuItem>

                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
                <TextField
                  fullWidth required
                  label="水電/安裝/木工"
                  placeholder="鏟子超人"
                  name="role_name"
                  type="text"
                  value={form.role_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
                <TextField
                  fullWidth required
                  label="數量"
                  placeholder=""
                  name="headcount_need"
                  type="number"
                  value={form.headcount_need}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 6 }}>
                <TextField
                  fullWidth required
                  label="量詞"
                  placeholder="人"
                  name="headcount_unit"
                  type="text"
                  value={form.headcount_unit}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>


          <FormControlLabel required control={<Checkbox onChange={e => setAgreeTerms(x => !x)} value={agreeTerms} />}
            label={<>我已理解本平台<a href="https://gf250923.org/terms" target="_blank">服務條款</a>
              及<a href="https://gf250923.org/privacy" target="_blank">隱私權政策</a>之使用</>}
          />

          <Alert severity="primary"><AlertTitle>注意：目前無法修改需求</AlertTitle>請再次確認資料是否正確</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">取消</Button>
          <Button
            variant="contained"
            onClick={() => setDisplayConfirmDialog(true)}
            disabled={
              form.address === "" ||
              form.org === "" ||
              form.phone === "" ||
              form.role_name === "" ||
              !form.role_type ||
              Number(form.headcount_need) < 1 ||
              form.headcount_unit === "" ||
              !agreeTerms
            }
          >
            確認新增
          </Button>
        </DialogActions>
      </StyledDialog>

      <StyledDialog open={displayConfirmDialog} fullWidth maxWidth="sm">
        <DialogTitle>確認新增需求</DialogTitle>
        <DialogContent>
          <Typography>
            <>
              <Typography>請再次確認以下資料是否正確：<br />
                <b>單位名稱：</b>{form.org}<br />
                <b>手機號碼：</b>{form.phone}<br />
                <b>地址：</b>{form.address}<br />
                <b>備註：</b>{form.assignment_notes}<br />
                <b>需求：</b>{form.role_type} | {form.role_name} | {form.headcount_need}{form.headcount_unit}
              </Typography>
              <Alert severity="primary"><AlertTitle>再次提醒：目前無法修改需求</AlertTitle>請再次確認資料是否正確</Alert>

            </>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisplayConfirmDialog(false)} color="inherit">返回修改</Button>
          <Button variant="contained" onClick={() => onConfirm(form)} loading={isLoading}>確認送出</Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
}
