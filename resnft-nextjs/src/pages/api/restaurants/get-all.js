import prisma from "../../../../prisma/lib/prisma";

export default async function handler(req, res) {
  const method = req.method;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const users = await prisma.user.findMany({
    where: {
      isRestaurant: true,
    },
  });

  return res.status(200).json({ users: users });
}
