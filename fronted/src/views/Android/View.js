import { useLocation } from 'react-router-dom';
import { Carousel, Modal, Button, Typography, Space } from 'antd';
import { useState } from 'react';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useApi from '../../Hooks/useApi';
import './AndroidView.css';
import Waiting from '../Helper/Waiting'
import { fas } from '@fortawesome/free-solid-svg-icons';

const { Title, Text } = Typography;

const AndroidView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData = location.state?.rowData;
    const currentKey = location.state?.currentKey;
    const api = useApi();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!rowData) {
        return <div className="no-data">No data available.</div>;
    }

    const handleBack = () => {
        window.history.back();
    };

    const handleBuy = () => {
        setIsModalVisible(true);
    };

    const handleConfirm = async () => {
        setIsModalVisible(false);
        setIsLoading(true);  // Set loading true before the request starts

        let endpoint = '/api/transaction/android'; // Default endpoint for Android
        let requestData = {
            price: rowData.price,
            owner: rowData.owner,
            androidId: rowData.id,
            brand: rowData.brand,
            model: rowData.model,
            buyerAddress: JSON.parse(localStorage.getItem('userData')).address
        };

        if (currentKey === '1') {
            endpoint = '/api/transaction/iphone'; // Endpoint for iPhone
            requestData = {
                price: rowData.price,
                owner: rowData.owner,
                iphoneId: rowData.id,
                brand: rowData.brand,
                model: rowData.model,
                buyerAddress: JSON.parse(localStorage.getItem('userData')).address
            };
        }

        try {
            const response = await api.post(endpoint, requestData);
            if (response.status === 200) {
                setTransactionMessage(response.data.message);
                setTransactionHash(response.data.txHash);
                setIsResultModalVisible(true);
            } else {
                const message = response.statusText || "Error with transaction";
                setTransactionMessage(message);
                setTransactionHash('');
                setIsResultModalVisible(true);
            }
        } catch (error) {
            console.error('Error during purchase:', error.message || "Network error");
            setTransactionMessage(error.message || "Network error");
            setTransactionHash('');
            setIsResultModalVisible(true);
        } finally {
            setIsLoading(false);  // Reset loading state whether the request succeeds or fails
        }
    };



    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleContactClick = () => {
        console.log("rowData.owner :", rowData.owner)
        console.log('ddd', JSON.parse(localStorage.getItem('userData')).address)
        if (rowData.owner != JSON.parse(localStorage.getItem('userData')).address) {
            navigate('/user/communcation', { state: { owner: rowData.owner } });
        } else {
            alert('不能联系自己')
        }

    }
    return (
        <div className="android-view">
            <div className="left-pane">
                <Carousel autoplay>
                    {rowData.imagepath?.split(',').map((image, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={`/asserts/images/${image}`} alt={`${index}`} />
                        </div>
                    ))}
                </Carousel>
                <div style={{ marginTop: '5px', textAlign: 'center' }}>
                    <hr style={{ borderTop: '1px solid #000', width: '100%' }} />
                    <Text style={{ marginTop: '5px' }}><strong>描述:</strong> {rowData.description || 'N/A'}</Text>
                </div>
            </div>

            <div className="right-pane" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                <Title level={3} style={{ marginBottom: '10px', color: '#000' }}>{rowData.brand} - {rowData.model}</Title>
                <Text className="price" style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>${rowData.price}</Text>
                <Space direction="vertical" className="details" style={{ marginTop: '20px' }}>
                    <Text><strong>所有者地址:</strong> {rowData.owner || 'N/A'}</Text>
                    <Text><strong>是否已售:</strong> {rowData.issold ? '是' : '否'}</Text>
                    <Text><strong>交易时间:</strong> {rowData.transactiontime || 'N/A'}</Text>
                </Space>

                <div className="button-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="primary" icon={<PhoneOutlined />}
                        href={`tel:${rowData.contactPhone}`}
                        onClick={handleContactClick}
                        style={{ backgroundColor: '#ffcc00', borderColor: '#ffcc00', marginRight: '10px' }}
                    >
                        联系卖家
                    </Button>
                    {rowData.contactEmail && (
                        <Button type="primary" icon={<MailOutlined />} href={`mailto:${rowData.contactEmail}`} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', marginRight: '10px' }}>
                            {rowData.contactEmail}
                        </Button>
                    )}
                </div>

                <div className="button-container" style={{ marginTop: '20px' }}>
                    <Button type="primary" onClick={handleBuy} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', marginRight: '10px' }}>购买</Button>
                    <Button onClick={handleBack}>返回</Button>
                </div>
            </div>

            <Modal
                title="确认购买"
                visible={isModalVisible}
                onOk={handleConfirm}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
            >
                <Text>确定支付 {rowData.price} 吗？</Text>
            </Modal>

            <Modal
                title="交易结果"
                visible={isResultModalVisible}
                onOk={() => setIsResultModalVisible(false)}
                onCancel={() => setIsResultModalVisible(false)}
                okText="确定"
                cancelText="关闭"
            >
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#123456', fontWeight: 'bold' }}>
                    <strong>消息:</strong> {transactionMessage}
                </p>
                {transactionHash && (
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#654321', fontWeight: 'bold' }}>
                        <strong>交易哈希:</strong> <br /> {transactionHash}
                    </p>
                )}
            </Modal>
            <Waiting isOpen={isLoading} message="正在数据上链..." />
        </div>

    );
};

export default AndroidView;
