const {  
  Connection,  
  Transaction,  
  SystemProgram,  
  LAMPORTS_PER_SOL,   
  sendAndConfirmTransaction,  
  PublicKey,  
} = require("@solana/web3.js");   

const dotenv = require('dotenv');  
dotenv.config();  
import axios from 'axios';  
import { getKeypairFromEnvironment } from "@solana-developers/helpers";  

async function main() {  
  const suppliedToPubkey = process.argv[2] || null;  

  if (!suppliedToPubkey) {  
    console.log(`Please provide a public key to send to`);  
    process.exit(1);  
  }  

  const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");  

  const toPubkey = new PublicKey(suppliedToPubkey);   
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");  
  const transaction = new Transaction();   
  const LAMPORTS_TO_SEND = 100000000;  
  const sendSolInstruction = SystemProgram.transfer({  
    fromPubkey: senderKeypair.publicKey,  
    toPubkey,  
    lamports: LAMPORTS_TO_SEND,  
  });  

  const balanceInSOL = await connection.getBalance(senderKeypair.publicKey) / LAMPORTS_PER_SOL;  

  // Helper function to fetch SOL price  
  async function getSolPrice(): Promise<number> {  
    try {  
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {  
        params: {  
          ids: 'solana',         // Solana's ID in CoinGecko  
          vs_currencies: 'usd', // Price in USD  
        },  
      });  

      const price = response.data.solana.usd; // Extract the price  
      return price;  
    } catch (error) {  
      console.error('Error fetching SOL price:', error);  
      throw error;  
    }  
  }  

  // Ensure the price has been fetched before logging and proceeding  
  const solPrice = await getSolPrice();  
  console.log(`The current price of SOL is $${solPrice}`);  

  const balanceInUSD = balanceInSOL * solPrice;  
  console.log(`Balance of my wallet ${senderKeypair.publicKey} : $${balanceInUSD}`);  

  transaction.add(sendSolInstruction);   
  const signature = await sendAndConfirmTransaction(connection, transaction, [  
    senderKeypair  
  ]);

  console.log(  
    `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `,  
  );  
  console.log(`Transaction signature is ${signature}!`);  
}  

// Run the main function  
main().catch((err) => {  
  console.error(err);  
});