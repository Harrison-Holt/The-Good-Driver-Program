import React, { useEffect, useState } from 'react';
import { Button, Typography, Stack } from '@mui/material';
import { DriverInfo, fetchSponsorDrivers, fetchUserInfo } from '../../utils/api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, selectUserName, setEmail, setFirstName, setGuestView, setLastName, setUserType } from '../../store/userSlice';
import SearchBar from '../SearchBar';

const ViewAsDriver: React.FC = () => {

    const [driverUsername, setDriverUsername] = useState<string>('');
    const [driverList, setDriverList] = useState<string[]>([]);
    const [driverInfo, setDriverInfo] = useState<DriverInfo[] | null>([]);

    const username = useAppSelector(selectUserName);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
          if (username) {
            let userInfo = await fetchUserInfo(username);
            if (userInfo?.sponsor_org_id) {
              const info = await fetchSponsorDrivers(userInfo.sponsor_org_id.toString())
              setDriverInfo(info);
              var driverUsernames: string[] = [];
              driverInfo?.map((driver) => {
                driverUsernames.push(driver.username)
              })
              setDriverList(driverUsernames)
              console.log(driverUsernames);
              console.log(driverList);
            }
          }
        }
        fetchData();
      }, [])

      const handleClick = () => {
        var selectedDriver: any = null;
         if (driverInfo) {
            driverInfo.forEach((driver) => {
                if (driver.username === driverUsername) {
                    selectedDriver = driver;
                }
            })
        }
        if (selectedDriver) {
            dispatch(setUserType("driver"))
            dispatch(login(driverUsername))
            dispatch(setFirstName(selectedDriver.first_name))
            dispatch(setLastName(selectedDriver.last_name))
            dispatch(setEmail(selectedDriver.email))
            dispatch(setGuestView(true))
        }
      }

    return (
        <>
            <Stack direction={"column"} spacing={2}>
                <Typography variant="h6">view As Driver</Typography>
                <SearchBar setSearchTerm={setDriverUsername} label={"Driver Username"} options={driverList}/>
                <Button variant={"contained"} onClick={handleClick}>Submit</Button>
            </Stack>
        </>
    )
}

export default ViewAsDriver;