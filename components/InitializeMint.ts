import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { MOVIE_REVIEW_PROGRAM_ID } from "../utils/constants";
require("dotenv").config();

async function main() {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

    // const wallet = web3.Keypair.generate();
    const wallet = getKeypairFromEnvironment("SECRET_KEY");

    const transaction = new web3.Transaction();

    const [tokenMint] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("token_mint")],
        new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    )

    const [mintAuth] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("token_auth")],
        new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    )

    const instruction = new web3.TransactionInstruction({
        keys: [
            {
                pubkey: wallet.publicKey,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: tokenMint,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: mintAuth,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: new web3.PublicKey("SysvarRent111111111111111111111111111111111"),
                isSigner: false,
                isWritable: false,
            },
        ],
        data: Buffer.from([3]),
        programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    })

    transaction.add(instruction);

    try {
        let txid = await web3.sendAndConfirmTransaction(connection, transaction, [wallet])
        alert(
            `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
        )
        console.log(
            `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
        )
    } catch (e) {
        console.log(JSON.stringify(e))
        alert(JSON.stringify(e))
    }
}

main();