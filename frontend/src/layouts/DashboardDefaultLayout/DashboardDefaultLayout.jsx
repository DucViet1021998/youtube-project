import { Layout, theme } from 'antd';

import { Store } from '~/store/store';
import { useEffect, useState, useContext } from 'react';
import HeaderDashboard from './HeaderDashboard';
import SideBarDashboard from './SideBarDashboard';
import request from "~/utils/request";
const { Content } = Layout;
function DashboardDefaultLayout({ children }) {
    const store = useContext(Store)
    const [user, setUser] = useState([])
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();

    useEffect(() => {

        // GỌI USER LẦN ĐẦU KHI LOGIN THÀNH CÔNG
        async function getUsers() {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            try {
                const users = await request.get('current-user', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })

                return setUser(users.data)
            }

            // KHI ACCESS TOKEN HẾT HẠN THÌ CALL API REFRESH TOKEN
            catch (error) {

                // Refresh Token 
                const response = await request.post('refresh-token',
                    {
                        refreshToken: refreshToken
                    })
                localStorage.setItem("accessToken", response.data.accessToken);

                // Return Function
                return getUsers()
            }
        }
        getUsers()
    }, []);




    return (
        <Layout hasSider style={{ height: '100vh' }}   >


            <SideBarDashboard
                style={{
                    overflow: 'auto',
                    height: '100vh',
                }}
            />

            <Layout className="site-layout" >

                <div
                    style={{
                        paddingRight: "10px",
                        top: 0,
                        position: 'sticky'
                    }}
                >
                    {user.map((u, i) => (
                        <HeaderDashboard key={i} data={u} />
                    ))}

                </div>

                <Content
                    style={{
                        margin: '0 16px',
                        overflow: 'auto',
                    }}
                >

                    <div
                        style={{
                            color: colorText,
                            minHeight: "100vh",
                            padding: 24,
                            background: colorBgContainer,
                        }}
                    >
                        {user.map((u, i) => (
                            <Store.Provider key={i} value={{ user, store }}>
                                {children}
                            </Store.Provider>
                        ))}
                    </div>
                </Content>

            </Layout>


        </Layout >
    )
}

export default DashboardDefaultLayout;