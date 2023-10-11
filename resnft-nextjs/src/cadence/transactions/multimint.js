
export const multimint = `

import RestNFT from 0x18bdaac138c4e23f

// This transaction allows the Minter account to mint multiple NFTs
// and deposit them into its collection.

transaction(mintDataArray: [String], mintBondArray: [UInt64], mintRoyaltiesArray: [UFix64], mintNameArray: [String]) {

    // The reference to the collection that will be receiving the NFTs
    let receiverRef: &{RestNFT.NFTReceiver}
    var creatorAddress: Address

    prepare(acct: AuthAccount) {
        // Get the owner's collection capability and borrow a reference
        self.receiverRef = acct.getCapability<&{RestNFT.NFTReceiver}>(RestNFT.CollectionPublicPath)
            .borrow() ?? panic("Could not borrow receiver reference")
        self.creatorAddress = acct.address
    }

    execute {

        // Ensure that the arrays are of equal length
        if mintDataArray.length != mintBondArray.length || mintDataArray.length != mintRoyaltiesArray.length || mintDataArray.length != mintNameArray.length {
            panic("Input arrays must be of equal length")
        }
        var i = 0
        // Iterate through the arrays and mint NFTs
        while (i < mintDataArray.length) {
            let newNFT <- RestNFT.mintNFT(mintData: mintDataArray[i], mintCreator: self.creatorAddress, 
                bond: mintBondArray[i], mintRoyalties: mintRoyaltiesArray[i], mintName: mintNameArray[i])

            self.receiverRef.deposit(token: <- newNFT)
            i = i + 1
        }
    }
}

`