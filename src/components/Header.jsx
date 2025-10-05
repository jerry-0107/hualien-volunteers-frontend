import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function Header({ onCreate }) {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Typography variant="h5">志工媒合</Typography>
                </Box>
                <Button variant="contained" onClick={onCreate}>
                    <AddIcon /> 新增人力需求
                </Button>
            </Toolbar>
        </AppBar>
    );
}
