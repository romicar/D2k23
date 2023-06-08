import React, {useState, useEffect} from 'react';
import {Page} from "./CreateStyles";
import CreateTopBar from "./Topbar_For_Template";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import TemplateModel from "../../../models/TemplateModel";
import {AIRTABLE_API_KEY, AIRTABLE_BASE_ID} from "../../../integrations/credentials";
import {AirtableTablesAndViews} from "../../../integrations/airtable.tables.views";
import Airtable from "airtable";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
// https://www.figma.com/file/cxLJDtRsGQnlfD1QZLQ5Oa/Product-Meditation-Generator-%7C-CMS?node-id=781%3A2126

  


function CreateTemplate  () {
    const navigate = useNavigate();
    let base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(AIRTABLE_BASE_ID);
    const [availableTemplates, setAvailableTemplates] = useState<TemplateModel[]>([]);
    const loadTemplatesAndSnippets = async () => {
        let table = base(AirtableTablesAndViews.Templates.TABLE_ID);
        let firstPage = await table.select({view: AirtableTablesAndViews.Templates.VIEW_ID}).firstPage()
        let templates = firstPage.map((record) => {
            return {
                label: record.get("templateDisplayName"),
                id: record.get("TemplateID"),
                value: record.get("TemplateID"),
                script: JSON.parse((record.get("templateStructure") ?? "{}") as string)
            } as TemplateModel
        })
        setAvailableTemplates(templates)
    }
    useEffect(() => {
        loadTemplatesAndSnippets()
    }, [])
    let rows = availableTemplates;
    rows = rows.filter((ele) => ele.id!==undefined);
    console.log(availableTemplates)
        return (
            <>
            <Page>
            <CreateTopBar/>
                <div>
                    <b style={{fontSize : '30px', marginLeft:'25px'}}>
                    Templates   
                    </b>
                    <Button variant="contained" color="primary" onClick={()=>navigate('./CreateTemplate')} sx={{ position: "fixed", top: 55, right: 25, zIndex: 2000 }} style={{backgroundColor : "#3e3e3e", color : "white"}}>
                        Create Template
                    </Button>
                </div>

                <br />
                <br />
                <TableContainer component={Paper} style={{width : '95%', marginLeft : "auto", marginRight : 'auto', textAlign : 'center' , fontWeight : "medium"}}>
      <Table sx={{ border:1, m : 'auto'}} style={{alignContent:'center', textAlign:"center"}} aria-label="simple table" >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{border :1, fontWeight: 'bold'}}>Template ID </TableCell>
            <TableCell align="center" sx={{border :1, fontWeight: 'bold'}}>Template Name</TableCell>
            <TableCell align="center" sx={{border :1, fontWeight: 'bold'}}>Action</TableCell>
            <TableCell align="center" sx={{border :1, fontWeight: 'bold'}}>Updates</TableCell>
            <TableCell align="center" sx={{border :1, fontWeight: 'bold'}}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            
                <TableRow
                key={row.id}
                sx={{border: 1}}
                
                >
                <TableCell align="center" component="th" scope="row" sx={{border: 1 , fontWeight : "medium"}}>
                    {row.id}
                </TableCell>
                <TableCell align="center" sx={{border: 1 , fontWeight : "medium"}}>{row.label}</TableCell>
                <TableCell align="center" sx={{border: 1 , fontWeight : "medium"}}>
                    <Button variant="outlined" startIcon={<EditIcon />} size="small"  sx={{ width: 50, padding: 0.2, margin: 0.1 }} style={{backgroundColor : "#3e3e3e", color : "white"}}>
                        Edit
                    </Button>
                    <br />
                    <Button variant="outlined" startIcon={<SyncIcon />} size="small"  sx={{ width: 50, padding: 0.2, margin: 0.1 }} style={{backgroundColor : "#3e3e3e", color : "white"}}>
                        Sync
                    </Button>
                </TableCell>
                <TableCell align="center" sx={{border: 1, fontWeight : "medium"}}>Get from DB</TableCell>
                <TableCell align="center" sx={{border: 1, fontWeight : "medium"}}>Maybe via hook</TableCell>
                </TableRow>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>

            </Page>
            </>
        )
   
};

export default CreateTemplate;  