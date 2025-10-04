import React from "react";
import { Box, Typography, Pagination } from "@mui/material";

export default function MyPagination({ page, count = 10, onPageChange }) {
    return (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">你在第 {page} 頁，跳到第</Typography>
            <Pagination
                count={count}
                page={page}
                onChange={(e, value) => onPageChange(value - 1)}
                color="primary"
                size="small"
            />
            <Typography variant="body2">頁</Typography>
        </Box>
    );
}
