import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoadingIndicator from '../Helper/Waiting';
import useApi from '../../Hooks/useApi';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [transactionData, setTransactionData] = useState(null);
    const [logs, setLogs] = useState([]);
    const api = new useApi();
    const url_getAxias = '/api/postEtherscanData/post';

    const handleSearch = () => {
        setIsLoading(true);
        const reqParameter = {
            parameter: `${searchTerm}`
        };
        api.post(url_getAxias, reqParameter)
            .then(response => {
                console.log('response data:', response.data);
                setTransactionData(response.data.transaction);
                // Check if logs are available and an array
                if (response.data.logs && Array.isArray(response.data.logs)) {
                    const filteredLogs = response.data.logs.map(log => ({
                        transactionId: log.transactionId || log[0],
                        phoneId: log.phoneId || log[1],
                        buyerId: log.buyerId || log[2],
                        sellerId: log.sellerId || log[3],
                        deviceType: log.deviceType || log[4],
                        brand: log.brand || log[5],
                        model: log.model || log[6],
                        transactionAmount: log.transactionAmount || log[7],
                        transactionTime: log.transactionTime || log[8]
                    }));
                    setLogs(filteredLogs); // Ensure logs is set as an array
                } else {
                    setLogs([]); // Ensure logs is set as an empty array if no logs are present
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLogs([]); // Reset logs on error
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ marginBottom: 2, width: '100%' }}>
                <TextField
                    label="Enter Hash/Block"
                    variant="outlined"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" onClick={handleSearch} disabled={isLoading}>
                    Search
                </Button>
                <LoadingIndicator isOpen={isLoading} message="正在查询链上信息..." />
            </Box>
            {logs.length > 0 && (
                <Box sx={{ marginTop: 2, width: '100%', textAlign: 'center', backgroundColor: '#fafafa', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: 2 }}>
                    <h2>Logs Details:</h2>
                    {logs.map((log, index) => (
                        <Box key={index} sx={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {Object.entries(log).map(([key, value]) => (
                                <Box key={key} sx={{ padding: '10px', borderBottom: '1px solid #bbb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                                        <strong style={{ marginRight: '5px', flexShrink: 0 }}>{key}:</strong>
                                        <span style={{ textAlign: 'center', flex: 1 }}>{value}</span>
                                    </div>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            )}
            {transactionData && (
                <Box sx={{ marginTop: 2, width: '100%', textAlign: 'center', backgroundColor: '#e0f7fa', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', padding: 2 }}>
                    <h2>Transaction Details:</h2>
                    {Object.entries(transactionData).map(([key, value]) => (
                        <Box key={key} sx={{ padding: '10px', borderBottom: '1px solid #bbb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                                <strong style={{ marginRight: '5px', flexShrink: 0 }}>{key}:</strong>
                                <span style={{ textAlign: 'center', flex: 1 }}>{value}</span>
                            </div>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SearchComponent;
