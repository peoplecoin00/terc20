import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { LightTheme } from '@/theme/theme';
import styles from './index.less';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import { Card } from 'antd';
import { Link, useHistory, useParams } from 'umi';

export default function BalancePage() {
    const history = useHistory()
  const [balances, __balances] = useState<{ tick: string; balance: string }[]>([]);
  const { tick, address } = useParams<{ tick?: string; address?: string }>();

  useEffect(() => {
    axios.get(`/api/terc_balances?addr=${address}`).then(res => {
        __balances(res?.data?.data ?? [])
    })
  }, [address])
  return (
    <ThemeProvider theme={LightTheme}>
      <Box
        className={styles.slogan}
        sx={{
          p: '20px',
        }}
      >
        <Box>
          <Typography component="h1" sx={{ cursor: 'pointer' }} onClick={() => {
            history.replace('/')
          }}>IERC-20 (Beta)</Typography>
        </Box>
        <Box
          textAlign={'center'}
          sx={{
            mt: '40px',
            mb: '20px',
          }}
        >
          <Typography sx={{ fontSize: '20px', mb: '20px' }}>
            Check out IERC-20 balance of the address.
          </Typography>
          <Search
            placeholder="input search address"
            allowClear
            onSearch={(value) => {
              console.log('value', value);
            }}
            enterButton
            style={{ maxWidth: 604 }}
          />
        </Box>
        <Box
          sx={{
            mt: '40px',
            border: '1px solid ',
            borderRadius: '10px',
            padding: '20px 20px',
          }}
        >
          <Box
            sx={{
              // borderBottom: '1px solid ',
              mb: '20px',
              textAlign: 'center',
              lineHeight: '2em',
            }}
          >
            <Typography component="h3">The full list of IERC-20</Typography>
          </Box>

          {(balances && balances.length > 0 ? balances : [{
            tick: 'ethi',
            balance: '0.0000',
          }]).map((balance, index) => <Card key={index} title={balance.tick} style={{ width: 300, display: 'inline-block', marginRight: '20px' }}>
            <Typography>Balance: {balance.balance}</Typography>
          </Card>)}

          <Table>
            {/* <TableHead>
              <TableRow>
                <TableCell align="center">Method</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Balance</TableCell>
                <TableCell align="center">Date Time</TableCell>
                <TableCell align="center">Date Time</TableCell>
              </TableRow>
            </TableHead> */}
            <Box sx={{ mt: '20px' }}></Box>
            <TableBody>
              <Typography>Transaction comming soon</Typography>
              <Box>
                <Link to={`/send_list/${address}`}>query links all relevant data</Link>
              </Box>
            </TableBody>
          </Table>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            svg: {
              p: '16px',
              width: '40px',
            },
          }}
        >
          <a href="https://twitter.com/EthinscXYZ" target="_blank">
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2174"
              width="200"
              height="200"
            >
              <path
                d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m248.123077 366.276923c-3.938462 3.938462-3.938462 7.876923-7.876923 7.876923-7.876923 7.876923-15.753846 11.815385-23.630769 15.753846-3.938462 0-3.938462 3.938462-3.938462 7.876923 3.938462 43.323077-3.938462 86.646154-19.692308 129.969231-27.569231 74.830769-86.646154 133.907692-157.538461 169.353846-59.076923 35.446154-129.969231 47.261538-192.984616 31.507693-31.507692-3.938462-59.076923-15.753846-82.707692-31.507693l-3.938461-3.938461c0-3.938462 3.938462-7.876923 7.876923-7.876923 19.692308 0 39.384615-3.938462 59.076923-11.815385 19.692308-7.876923 39.384615-19.692308 55.138461-31.507692l3.938462-3.938462c0-3.938462 0-7.876923-3.938462-7.876923-15.753846-3.938462-27.569231-11.815385-39.384615-19.692308-15.753846-7.876923-27.569231-23.630769-35.446154-39.384615v-3.938461c0-3.938462 3.938462-7.876923 7.876923-7.876924h11.815385c3.938462 0 3.938462 0 3.938461-3.938461 3.938462-3.938462 0-7.876923-3.938461-11.815385-15.753846-7.876923-27.569231-19.692308-39.384616-31.507692-15.753846-15.753846-23.630769-35.446154-23.630769-55.138462v-3.938461c0-3.938462 7.876923-3.938462 7.876923-3.938462 3.938462 0 7.876923 3.938462 11.815385 3.938462h7.876923c3.938462 0 3.938462 0 7.876923-3.938462s3.938462-7.876923 0-11.815384c-15.753846-15.753846-27.569231-35.446154-31.507692-59.076923-3.938462-19.692308 0-43.323077 7.876923-63.015385v-3.938461c-7.876923 3.938462-3.938462 3.938462 0 7.876923 27.569231 27.569231 55.138462 51.2 90.584615 70.892307 39.384615 19.692308 82.707692 31.507692 126.030769 31.507693 3.938462 0 7.876923-3.938462 7.876923-7.876923 0-23.630769 7.876923-102.4 78.769231-122.092308 35.446154-11.815385 78.769231-3.938462 106.338462 27.569231 0 0 3.938462 3.938462 7.876923 3.938461 7.876923 0 15.753846-3.938462 27.569231-3.938461 7.876923-3.938462 15.753846-3.938462 23.630769-7.876923h7.876923c3.938462 0 3.938462 7.876923 3.938461 11.815384-3.938462 7.876923-11.815385 15.753846-19.692307 23.630769l-3.938462 3.938462c-3.938462 0-3.938462 3.938462-3.938461 7.876923s3.938462 7.876923 7.876923 7.876923 7.876923 0 15.753846-3.938461h7.876923c-3.938462-3.938462-3.938462 3.938462-7.876923 3.938461z"
                fill="#515151"
                p-id="2175"
              ></path>
            </svg>
          </a>
          <a href="https://github.com/peoplecoin00/terc20" target="_blank">
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1667"
              id="mx_n_1682104723756"
              width="200"
              height="200"
            >
              <path
                d="M0 524.992q0 166.016 95.488 298.496t247.488 185.504q6.016 0.992 10.016 0.992t6.496-1.504 4-3.008 2.016-4.992 0.512-4.992v-100.512q-36.992 4-66.016-0.512t-45.504-14.016-28.992-23.488-16.992-25.504-8.992-24-5.504-14.496q-8.992-15.008-27.008-27.488t-27.008-20-2.016-14.496q50.016-26.016 112.992 66.016 34.016 51.008 119.008 30.016 10.016-40.992 40-70.016Q293.984 736 237.984 670.976t-56-158.016q0-87.008 55.008-151.008-22.016-64.992 6.016-136.992 28.992-2.016 64.992 11.488t50.496 23.008 25.504 17.504q56.992-16 128.512-16t129.504 16q12.992-8.992 28.992-19.008t48.992-21.504 60.992-9.504q27.008 71.008 7.008 135.008 56 64 56 151.008 0 92.992-56.992 158.496t-172 85.504q43.008 43.008 43.008 104v128.992q0 0.992 0.992 3.008 0 6.016 0.512 8.992t4.512 6.016 12 3.008q152.992-52 250.496-185.504t97.504-300.512q0-104-40.512-199.008t-108.992-163.488-163.488-108.992T512.032 12.96 313.024 53.472 149.536 162.464t-108.992 163.488-40.512 199.008z"
                p-id="1668"
                fill="#515151"
              ></path>
            </svg>
          </a>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

declare global {
  interface Window {
    ethereum: any;
  }
}
