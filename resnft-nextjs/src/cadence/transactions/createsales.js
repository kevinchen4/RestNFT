export const createSales = `

// createsale.cdc

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import RestNFT from 0x18bdaac138c4e23f
import Marketplace from 0x5b0d2b644cfa424e

// create a sale for the reservation
transaction(tokenIDs: [UInt64], prices: [UFix64]) {

    prepare(acct: AuthAccount) {

        // take the sale object out
        let sale <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)
        ?? panic("Could not load Sale Collection object")

        var i = 0

        while i < tokenIDs.length {
        // List the token for sale by moving it into the sale object
            sale.listForSale(tokenID: tokenIDs[i], price: prices[i])
            i = i + 1
        }
        // Store the sale object in the account storage
        acct.save(<-sale, to: /storage/NFTSale)

        // Create a public capability to the sale so that others can call its methods
        acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)
    }
}

`