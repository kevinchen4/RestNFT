export const mint = `

import RestNFT from 0x18bdaac138c4e23f

// This transaction allows the Minter account to mint an NFT
// and deposit it into its collection.

transaction(mintData: String, mintBond: UInt64, mintRoyalties: UFix64, mintName: String) {

    // The reference to the collection that will be receiving the NFT
    let receiverRef: &{RestNFT.NFTReceiver}
    var creatorAddress: Address

    prepare(acct: AuthAccount) {
        // Get the owner's collection capability and borrow a reference
        self.receiverRef = acct.getCapability<&{RestNFT.NFTReceiver}>(RestNFT.CollectionPublicPath)
            .borrow()
            ?? panic("Could not borrow receiver reference")
        self.creatorAddress = acct.address
    }

    execute {
        // Use the minter reference to mint an NFT, which deposits
        // the NFT into the collection that is sent as a parameter.
        let newNFT <- RestNFT.mintNFT(mintData: mintData, mintCreator: self.creatorAddress, 
            bond: mintBond, mintRoyalties: mintRoyalties, mintName: mintName)

        self.receiverRef.deposit(token: <-newNFT)

        log("NFT Minted")
    }
}
`