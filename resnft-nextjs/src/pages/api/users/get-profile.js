import prisma from "../../../../prisma/lib/prisma";

export default async function handler(req, res) {
  const method = req.method;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

	const { addr } = req.body;

	// Find user profile with address
	const user = await prisma.user.findUnique({
		where: { pubKey: addr },
	});

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

  return res.status(200).json({ user: user });
}
