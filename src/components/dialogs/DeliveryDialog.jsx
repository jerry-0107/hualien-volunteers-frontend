import React from "react";
import {
  DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, TextField, Alert, AlertTitle
} from "@mui/material";
import StyledDialog from "./StyledDialog";
import isCompleted from "../../utils/isCompleted";
import CustomProgressBar from "../Progress";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { safeApiRequest } from "../../utils/helpers";

function getRoleTypeColor(role_type, is_completed) {
  if (is_completed) return ""

  const TYPE_MAP = {
    "一般志工": { tag: "一般", cls: "", order: 5 },
    "清潔/整理": { tag: "清潔/整理", cls: "primary", order: 0 },
    "醫療照護": { tag: "醫療照護", cls: "error", order: 1 },
    "後勤支援": { tag: "後勤支援", cls: "success", order: 2 },
    "專業技術": { tag: "專業技術", cls: "warning", order: 3 },
    "其他": { tag: "其他", cls: "", order: 4 },
  };
  return TYPE_MAP[role_type].cls

}
export default function DeliveryDialog({ open, onClose, request, onSubmittedCallback = (isSuccess) => { } }) {
  const isRequestCompleted = isCompleted(request)
  const theme = useTheme();
  const isNotPhone = useMediaQuery(theme.breakpoints.up('sm')); //手機以上的螢幕寬度

  const [joinCount, setJoinCount] = React.useState(1);
  const maxNeeded = (!request) ? 0 : request.headcount_need - request.headcount_got;

  const [displayConfirmDialog, setDisplayConfirmDialog] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  async function onConfirm() {
    setIsLoading(true)
    const payload = {
      headcount_got: request.headcount_got + Number(joinCount),
      is_completed: request.headcount_got + Number(joinCount) === request.headcount_need,
      status: request.headcount_got + Number(joinCount) === request.headcount_need ? "completed" : "active"
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
      setIsLoading(false)
      setDisplayConfirmDialog(false)
      onSubmittedCallback(true)
      setJoinCount(1)

    }
    else {
      setIsLoading(false)
      setDisplayConfirmDialog(false)
      onSubmittedCallback(false)
    }
  }




  return (
    <><StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>人力派遣</DialogTitle>
      <DialogContent>
        {request && <><Typography variant="body2" sx={{ mb: 1 }}>目前人力需求進度</Typography>
          <Box>
            <Box sx={{ mt: 1, display: (isNotPhone ? "flex" : "block"), justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip size="small" color={getRoleTypeColor(request.role_type, isRequestCompleted)} label={request.role_type} sx={{ mr: 1 }} />
                <Typography variant="body"><b>{request.role_name}</b>&nbsp;</Typography>
              </Box>
              <Box sx={{ mt: (isNotPhone ? 0 : 1) }}>
                {!isRequestCompleted ?
                  <>已到位 {request.headcount_got}/{request.headcount_need}{request.headcount_unit}，還需要 <Typography sx={{ display: "inline-block" }} color="error">{request.headcount_need - request.headcount_got}{request.headcount_unit}</Typography> </> :
                  <Typography color="success">總共需 {request.headcount_got}{request.headcount_unit}，已全部到位!</Typography>}
              </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
              <CustomProgressBar percentage={(request.headcount_got / request.headcount_need) * 100} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth required
                label="加入數量"
                placeholder=""
                type="number"
                value={joinCount}
                onChange={e => setJoinCount(e.target.value)}
                inputProps={{ min: 1, max: maxNeeded }}
              />
            </Box>
          </Box></>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">取消</Button>
        <Button variant="contained" onClick={() => setDisplayConfirmDialog(true)}
          disabled={joinCount < 1 || joinCount > maxNeeded}
        >確認加入</Button>
      </DialogActions>
    </StyledDialog>






      <StyledDialog open={displayConfirmDialog} fullWidth maxWidth="sm">
        <DialogTitle>確認加入 {request && request.org}</DialogTitle>
        <DialogContent>
          <Typography>
            {request && <>
              <Typography >請再次確認以下資料是否正確：<br />
                <b>加入數量：</b>{joinCount}{request.headcount_unit}
              </Typography>
              <Alert severity="primary" sx={{ mt: 1 }}>
                <AlertTitle>我們期待你的出現！</AlertTitle>
                <b>若你誤觸送出而顯示這個畫面，請點選下方的按鈕返回</b><br />
                {(request.headcount_got + Number(joinCount) === request.headcount_need) && "在你加入後，這個需求將會被標示為已完成，如需再次查看這個需求，請點選上方⌈已完成⌋頁籤"}
              </Alert>
            </>}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisplayConfirmDialog(false)} color="inherit">返回修改</Button>
          <Button variant="contained" onClick={onConfirm} loading={isLoading}>確認加入</Button>
        </DialogActions>
      </StyledDialog>


    </>
  );
}
