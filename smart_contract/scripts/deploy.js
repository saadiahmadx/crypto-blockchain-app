const main = async () => {

  //this generates instance of the transation contract to then use
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log(
    `Transactions deployed to: ${transactions.address}`
  );
}

const runMain = async () => {
  try {
    await main();
    process.exitCode = 0;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

runMain();