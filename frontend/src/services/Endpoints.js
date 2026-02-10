import React from 'react'
import AxiosInstance from './Axios'

//get the employee account data
export const GetData = async () => {
  const res = await AxiosInstance.get("account/");
  return res.data.data.accounts;
};

//change status
export const ToggleStatus = async (id,currentStatus) =>{
    return await AxiosInstance.patch(`account/${id}/`,{
        status : !currentStatus,
    })
}

//update account
export const updateAccount = async (id, data) => {
  const res = await AxiosInstance.put(`account/${id}/`, data);
  return res.data.data.accounts;
};

