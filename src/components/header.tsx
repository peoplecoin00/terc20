import { addressToStr } from '@/hooks/address';
import { useEth } from '@/hooks/useeth';
import { Box, Typography } from '@mui/material';
import { Button } from 'antd';
import { useHistory, useLocation } from 'umi';

localStorage.wl = JSON.stringify([
  '0xB3A6C05c1b795b08c9Ed936478A244529EDA20C0',
  '0x8E999D2B74B1A1a29811622665D44bE4219A0831',
  '0x9c69821d06De9d411D4CE45d0f0133463EB0e827',
  '0x56d162d2f05DD8a37CDDeB36FB2Fe7a7cC3d20F0',
  '0xB9a2afFE25291b86CF8a4f0CFD97FdDB5dBB73e2',
  '0x71F66df108A0a5d5849531ebb7Ce9C1F5D209c0A',
  '0xaCD9875a763C1A2Ce97b073B65467c7B064C6fD9',
  '0xF79DDd3cAa5357B368d8Ecb0B5E7D0631E37246e',
  '0x9438ac0358a2c9654cb8cd5f3cc0465e524cc78b',
])

export const Header = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { address, connect } = useEth();
  const wl: string[] = (localStorage.getItem('wl') ? JSON.parse(localStorage.getItem('wl') as string) : []).map((e: string) => e.toLocaleLowerCase())
  const isWl = wl.includes(address?.toLocaleLowerCase() ?? '')
  return (
    <Box>
      <Box
        sx={{
          background: '#fff',
          p: '20px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Typography
            component="h1"
            sx={{
              cursor: 'pointer',
              backgroundImage: 'linear-gradient(to right, orange, purple)',
              '-webkit-background-clip': 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
            onClick={() => {
              history.replace('/');
            }}
          >
            IERC-20 (Beta)
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              ml: '40px',
            }}
          >
            {[
              {
                t: 'Search',
                link: '/balance',
                icon: (
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M763.221333 702.848L981.333333 921.002667 921.002667 981.333333l-218.154667-218.112A403.626667 403.626667 0 0 1 448 853.333333a405.333333 405.333333 0 1 1 405.333333-405.333333 403.626667 403.626667 0 0 1-90.112 254.848zM448 768a320 320 0 1 0 0-640 320 320 0 0 0 0 640z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ),
              },
              {
                t: 'Deploy',
                link: '/deploy',
                icon: (
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                  >
                    <path d="M659.655431 521.588015q23.970037-6.71161 46.022472-13.423221 19.17603-5.752809 39.310861-11.505618t33.558052-10.546816l-13.423221 50.816479q-5.752809 21.093633-10.546816 31.640449-9.588015 25.88764-22.531835 47.940075t-24.449438 38.35206q-13.423221 19.17603-27.805243 35.475655l-117.932584 35.475655 96.838951 17.258427q-19.17603 16.299625-41.228464 33.558052-19.17603 14.382022-43.625468 30.202247t-51.29588 29.243446-59.925094 13.902622-62.801498-4.314607q-34.516854-4.794007-69.033708-16.299625 10.546816-16.299625 23.011236-36.434457 10.546816-17.258427 25.40824-40.749064t31.161049-52.254682q46.022472-77.662921 89.168539-152.449438t77.662921-135.191011q39.310861-69.992509 75.745318-132.314607-45.06367 51.775281-94.921348 116.014981-43.146067 54.651685-95.88015 129.917603t-107.385768 164.434457q-11.505618 18.217228-25.88764 42.187266t-30.202247 50.816479-32.599251 55.131086-33.078652 55.131086q-38.35206 62.322097-78.621723 130.397004 0.958801-20.134831 7.670412-51.775281 5.752809-26.846442 19.17603-67.116105t38.35206-94.921348q16.299625-34.516854 24.928839-53.692884t13.423221-29.722846q4.794007-11.505618 7.670412-15.340824-4.794007-5.752809-1.917603-23.011236 1.917603-15.340824 11.026217-44.58427t31.161049-81.977528q22.052434-53.692884 58.007491-115.535581t81.018727-122.726592 97.797753-117.932584 107.865169-101.153558 110.262172-72.389513 106.906367-32.11985q0.958801 33.558052-6.71161 88.689139t-19.17603 117.932584-25.88764 127.520599-27.805243 117.453184z"
                        fill='currentColor'
                    ></path>
                  </svg>
                ),
              },
              {
                t: 'Ierc-20',
                link: '/',
                icon: (
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="9588"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M170.666667 256a128 128 0 0 1 128-128h42.666666v85.333333H298.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v170.666667a128 128 0 0 1-128 128v-85.333334a42.666667 42.666667 0 0 0 42.666667-42.666666V256z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M256 597.333333a128 128 0 0 0-128-128H85.333333v85.333334h42.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v170.666667a128 128 0 0 0 128 128v-85.333333a42.666667 42.666667 0 0 1-42.666667-42.666667v-170.666667zM853.333333 256a128 128 0 0 0-128-128h-42.666666v85.333333h42.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v170.666667a128 128 0 0 0 128 128v-85.333334a42.666667 42.666667 0 0 1-42.666667-42.666666V256z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M768 597.333333a128 128 0 0 1 128-128h42.666667v85.333334h-42.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v170.666667a128 128 0 0 1-128 128v-85.333333a42.666667 42.666667 0 0 0 42.666667-42.666667v-170.666667z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ),
              },
              {
                t: 'Market',
                link: '/market',
                disabled: !isWl,
                icon: (
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="8712"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M873.411765 219.858824h-153.6c-15.058824-120.470588-102.4-180.705882-207.811765-180.705883s-192.752941 60.235294-207.811765 180.705883H150.588235l-60.235294 783.058823h843.294118l-60.235294-783.058823z m-361.411765-120.470589c72.282353 0 132.517647 30.117647 147.576471 120.470589h-295.152942c15.058824-90.352941 75.294118-120.470588 147.576471-120.470589z m-355.388235 843.294118l51.2-662.588235h608.37647l51.2 662.588235H156.611765z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ),
              },
            ].map(({ t, link, icon, disabled }, index) => {
              return (
                <Box
                  key={t}
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    svg: {
                      width: '16px',
                      height: '16px',
                      mr: '5px',
                    },
                  }}
                >
                  <Button
                    // component="h1"
                    type="text"
                    style={{
                      cursor: 'pointer',
                      color:
                      disabled ? 'rgba(0,0,0,0.1)' : pathname === link ? '#1677ff' : 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '16px',
                    }}
                    disabled={disabled}
                    onClick={() => {
                      history.push(link);
                    }}
                  >
                    {icon}
                    {t}
                  </Button>
                  {index !== 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '-2px',
                        height: '1.2em',
                        width: '1px',
                        background: 'rgba(0,0,0,0.3)',
                        transform: 'translate(0px, -50%)',
                      }}
                    ></Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box>
          {address ? (
            <Button
              type="text"
              onClick={() => {
                history.push('/balance/' + address);
              }}
            >
              {addressToStr(address)}
            </Button>
          ) : (
            <Button onClick={connect}>Connect Wallet</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
