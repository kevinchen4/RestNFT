export const transfer = `

import RestNFT from 0x18bdaac138c4e23f

// This transaction transfers an NFT from one user's collection
// to another user's collection.
transaction (tokenid: UInt64, transferAddress: Address) {

    // The field that will hold the NFT as it is being
    // transferred to the other account
    let transferToken: @RestNFT.NFT

    prepare(acct: AuthAccount) {

        // Borrow a reference from the stored collection
        let collectionRef = acct.borrow<&RestNFT.Collection>(from: RestNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // Call the withdraw function on the sender's Collection
        // to move the NFT out of the collection
        self.transferToken <- collectionRef.withdraw(withdrawID: tokenid)
    }

    execute {
        // Get the recipient's public account object
        let recipient = getAccount(transferAddress)

        // Get the Collection reference for the receiver
        // getting the public capability and borrowing a reference from it
        let receiverRef = recipient.getCapability<&{RestNFT.NFTReceiver}>(RestNFT.CollectionPublicPath)
            .borrow()
            ?? panic("Could not borrow receiver reference")

        // Deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken)

        log("NFT transferred")
    }
}
`