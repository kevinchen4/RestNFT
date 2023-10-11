import prisma from "../../../../prisma/lib/prisma";

export default async function handler(req, res) {
  const method = req.method;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const reservationNFTList = req.body.nfts;
  const pubKey = req.body.addr;

  for (let nft of reservationNFTList) {
    const reservationID = nft.Name;
    const nftID = nft.ID;

    try {
      const updateReservationNFT = await prisma.reservation.update({
        where: {
          id: reservationID,
        },
        data: {
          nft: nftID,
        },
      });
      console.log(updateReservationNFT);
    } catch (error) {
      console.log(error);
    }
  }

  return res.status(200).json({
    message: "NFT added to reservation entries.",
  });
}
