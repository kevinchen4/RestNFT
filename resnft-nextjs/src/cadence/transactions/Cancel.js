
export const cancelSale = `

// cancel.cdc

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import RestNFT from 0x18bdaac138c4e23f
import Marketplace from 0x5b0d2b644cfa424e


// cancel a group of sales for the reservation
transaction(tokenIDs: [UInt64]) {
    
    prepare(acct: AuthAccount) {
        let saleCollection <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)
        ?? panic("Could not load Sale Collection object")
        for tokenID in tokenIDs {
            saleCollection.cancelSale(tokenID: tokenID)
        }
        acct.save(<-saleCollection, to: /storage/NFTSale)
        
    }

}

`