require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/Bx7Npvx1F1xgSDw4f51U8TkdJCkxrWsE',
      accounts: [ '7743635e146c5925beacdf72a6ffe231868bce2a58a45c595c2c8647ea41563a' ]
    }
  }
}
