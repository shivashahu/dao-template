import { ethers, network } from "hardhat"
import {
  PROPOSAL_FUNC,
  NEW_PROPOSAL_DESCRIPTION,
  PROPOSAL_NAME,
  MIN_DELAY,
  developmentChains,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

export async function queueAndExecute() {
  const args = [PROPOSAL_NAME]
  const functionToCall = PROPOSAL_FUNC
  const proposal = await ethers.getContract("Proposal")
  const encodedFunctionCall = proposal.interface.encodeFunctionData(functionToCall, args)
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(NEW_PROPOSAL_DESCRIPTION))
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract")
  console.log("Queueing...")
  const queueTx = await governor.queue([proposal.address], [0], [encodedFunctionCall], descriptionHash)
  await queueTx.wait(1)

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)
  }

  console.log("Executing...")
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    [proposal.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  )
  const executeTxRec = await executeTx.wait(1)
  console.log(executeTxRec);
  
  // console.log(`Box value: ${await proposal.retrieveProposal()}`)
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
