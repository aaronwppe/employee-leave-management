import React,{useMemo,useState,useEffect} from 'react'
import {Box,Switch,Stack, Chip, Typography,IconButton, Dialog, DialogTitle, DialogContent,DialogActions,Button, DialogContentText, Tooltip } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {MaterialReactTable} from 'material-react-table';
import {getAccounts,toggleStatus,updateAccount } from '../../services/api/account.api';
import EmployeeOnboard from "../../components/forms/EmployeeForm";

const EmployeeTable = () =>{
    const [showOnboard, setShowOnboard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [account, setAccount] = useState([]);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedRow, setSelectedRow] = useState(null);
     // fetch data
    const fetchAccounts = async () => {
        const data = await getAccounts();
        setAccount(data);
    };
    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // Handle status change
    const handleStatusChange = async () => {
        if (!selectedRow) return;
        setLoading(true);
        try {
            await toggleStatus(selectedRow.id, selectedRow.status);
            const data = await getAccounts();
            setAccount(data);
            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // edit handler
    const handleSaveRow = async ({ values,row, table }) => {
        try {
            setIsSaving(true);
            const id = row.original.id;
            await updateAccount(id, values);

            // refresh table data
            const data = await getAccounts();
            setAccount(data);

            // close modal
            table.setEditingRow(null);
        } catch (error) {
            console.error("Update failed:", error);
        }finally {
            setIsSaving(false); // stop loading
        }
    };

    // create account popup handler
    const openOnaboard = ()=>{
        setShowOnboard(true)
    }
    const closeOnaboard = ()=>{
        setShowOnboard(false)
    }
    

    // table columns
    const columns = useMemo(
        () => [
            {
                accessorKey:'first_name',
                header: 'First Name'
            },
            {
                accessorKey:'last_name',
                header: 'Last Name'
            },
            {
                accessorKey:'email',
                header: 'Email'
            },
            {
                accessorKey:'allocated_leaves',
                header: 'Allocated Leaves'
            },
            {
                accessorKey:'status',
                header: 'Status',
                // table display view
                Cell: ({ cell }) => cell.getValue() ? 
                    (<Chip label="Active" color="success" variant="filled" />) 
                    :(<Chip label="Inactive" color="error" variant="outlined" />),

                // for edit view 
                Edit: ({ cell, row }) => {
                    const [checked, setChecked] = React.useState(cell.getValue());

                    return (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Inactive</Typography>
                            <Switch
                                checked={checked}
                                onChange={(e) => {
                                    setChecked(e.target.checked);
                                    row._valuesCache.status = e.target.checked;
                                }}
                                color="success"
                            />
                            <Typography>Active</Typography>
                        </Stack>
                    );
                },

            }
        ],
        []
    )

    return(
        <div>
            <Box className={"TopBar"}>
                <CalendarViewMonthIcon/>
                <Typography sx={{marginLeft:'15px',fontWeight:'bold'}} variant='subtitle2'>
                    View all Employees Account
                </Typography>
            </Box>
            
            <MaterialReactTable
                columns={columns}
                data={account}
                enableRowActions
                enableEditing
                editingMode="modal"

                initialState= {{
                    pagination: { pageSize: 5, pageIndex: 0 },
                    showGlobalFilter: true,
                }}
                muiPaginationProps= {{
                    rowsPerPageOptions: [5, 10, 15],
                    variant: 'outlined',
                }}

                paginationDisplayMode= 'pages'
                enableGlobalFilter
                positionGlobalFilter="left"
                muiSearchTextFieldProps={{
                    size: "small",
                    variant: "standard",
                    placeholder: "Search employees...",
                }}

                enableTopToolbar
                enableToolbarInternalActions={false}
                
                onEditingRowSave={handleSaveRow}
                state={{ isSaving }}
                muiEditRowDialogProps={{
                    disableEscapeKeyDown: isSaving,
                }}
                // create account button
                renderTopToolbarCustomActions={() => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                        <Button
                        color="primary"
                        onClick={openOnaboard}
                        variant="contained"
                        >
                        + Create Account
                        </Button>
                    </Box>
                )}
                
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                    {/* Change status */}
                    <Tooltip title="Account Status" placement='top' arrow>
                    <IconButton
                        color="primary" 
                        onClick={() => {
                            setSelectedRow(row.original);
                            handleClickOpen();
                        }}
                    >
                        {row.original.status ?
                            (<CheckCircleIcon color='success' />):(<CancelIcon color='error'/>)
                        }
                    </IconButton>
                    </Tooltip>
                    {/* Edit the information */}
                    <Tooltip title="Edit" placement='top' arrow>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            table.setEditingRow(row);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    </Tooltip>
                    {/* Leave History */}
                    <Tooltip title="Show Leave History" placement='top' arrow>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            console.log("clicked!");
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                    </Tooltip>
                    </Box>
                )}
            />
            {/* confirmation dialog */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Change Account Status"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are You Sure You Want To change this account's status?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} disabled={loading}>
                        No
                    </Button>
                    <Button autoFocus onClick={handleStatusChange} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : "Yes"}

                    </Button>

                </DialogActions>
            </Dialog>
            
            {/* Employee onboarding popup */}
            {showOnboard && (
            <EmployeeOnboard
                onClose={closeOnaboard}
                onEmployeeCreated={fetchAccounts}
            />
            )}        
        </div>
    )
}

export default EmployeeTable