import prisma from "../../../../prisma/lib/prisma";

export default async function handler(req, res) {
  const method = req.method;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userType, name, email, phone, location, menu, description, pubKey } =
    req.body;

  const isRestaurant = userType === "restaurant";

  const data = {
    pubKey: pubKey,
    isRestaurant: isRestaurant,
    name: name,
    email: email,
    phone: phone,
    location: location,
    menu: menu,
    description: description,
  };

  // Create new user
  const user = await prisma.user.upsert({
    where: { pubKey: pubKey },
    update: data,
    create: data,
  });

  return res.status(200).json({user: user });
}
