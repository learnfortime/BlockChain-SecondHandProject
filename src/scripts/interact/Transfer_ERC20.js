// 引入 ethers 库
const { ethers } = require('ethers');
const myTokenAbi = require('../../abi/MyTokenAbi.json');

// 设置提供者为 Ganache
const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:8545');
const signer = provider.getSigner();

// 从deployedAddresses.json文件获取合约地址
const deployedAddress = require('../../deployedAddresses.json');
const myTokenContractAddress = deployedAddress.MyToken;

// 创建合约实例
const myTokenContract = new ethers.Contract(myTokenContractAddress, myTokenAbi, signer);

async function transferToken(to, amount) {
    try {
        // 调用合约的 transfer 函数
        const txResponse = await myTokenContract.transfer(to, ethers.utils.parseUnits(amount.toString(), 18)); // 假设代币是18位小数
        await txResponse.wait(); // 等待交易确认

        console.log(`Tokens successfully transferred to ${to}`);
    } catch (error) {
        console.error(`Error during token transfer: ${error}`);
    }
}

// 命令行参数
const toAddress = process.argv[2];
const amount = process.argv[3];

// 执行转账
if (toAddress && amount) {
    transferToken(toAddress, amount);
} else {
    console.log("Usage: node transferToken.js <to_address> <amount>");
}