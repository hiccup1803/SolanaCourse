const {  
  Connection,  
  Transaction,    
  sendAndConfirmTransaction,
  TransactionInstruction, 
  PublicKey,  
} = require("@solana/web3.js");  

const dotenv = require('dotenv');  
dotenv.config();  
import {  getKeypairFromEnvironment, } from "@solana-developers/helpers";

const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection("https://api.devnet.solana.com", "confirmed"); 

const transaction = new Transaction();
const programId = new PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new TransactionInstruction({
  keys: [
    {
      pubkey: pingProgramDataId,
      isSigner: false,
      isWritable: true,
    },
  ],
  programId,
});
console.log(`Instruction is created`);

transaction.add(instruction);
console.log(`Instruction is added to the transaction`);

const signature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer],
);

console.log(`✅ Transaction completed! Signature is ${signature}`);