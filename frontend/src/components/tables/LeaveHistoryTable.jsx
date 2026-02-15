// import React,{useMemo,useState,useEffect} from "react";
// import { GetLeave } from "../../services/Endpoints";


// const LeaveHistoryTable = ()=>{
//     const [leave, setLeave] = useState([])

//     // fetch leave
//     const fetchLeave = async ()=>{
//         const data = await GetLeave();
//         setLeave(data);
//     };
//     useEffect(()=>{
//         fetchLeave();
//     },[]);

//     // table columns
//     const columns = useMemo(
//         ()=>[
//             {accessorKey:'', header: ''}
//         ],[]
//     )
//     return(
//         <div>
            
//         </div>
//     );
// }

// export default LeaveHistoryTable