import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box
} from "@mui/material";
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { safeApiRequest } from "../../utils/helpers";

export default function EditDialog({ open, onClose, request, onSubmittedCallback = (isSuccess) => { } }) {
  const [form, setForm] = useState({
    org: "",
    phone: "",
    address: "",
    assignment_notes: "",
    headcount_need: 1,
    headcount_unit: "",
    role_name: ""
  });
  useEffect(() => {
    console.log(request)
    if (request) setForm(request);
  }, [request]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function onConfirm() {

    const payload = {
      ...form, headcount_need: Number(form.headcount_need)
    }
    const result = await safeApiRequest(
      `https://guangfu250923.pttapp.cc/human_resources/${request.id}`,
      {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );
    if (result.success) {
      onSubmittedCallback(true)
    }
    else {
      onSubmittedCallback(false)
    }
  }


  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>修改需求</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, pt: 1 }}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, md: 6 }}>

              <TextField
                fullWidth required
                label="單位名稱"
                name="org"
                value={form.org}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>

              <TextField
                fullWidth
                label="手機號碼"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>

              <TextField
                fullWidth required
                label="地址"
                name="address"
                value={form.address}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>

              <TextField
                fullWidth multiline rows={3}
                label="備註"
                name="assignment_notes"
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
                label="需求名稱"
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
                label="數量單位"
                placeholder="人"
                name="headcount_unit"
                type="text"
                value={form.headcount_unit}
                onChange={handleChange}
              />
            </Grid>

          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">取消</Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(form)}
          disabled={
            form.address === "" ||
            form.org === "" ||
            form.role_name === "" ||
            !form.role_type ||
            Number(form.headcount_need) < 1 ||
            form.headcount_unit === ""
          }
        >
          確認修改
        </Button>
      </DialogActions>
    </Dialog>
  );
}
