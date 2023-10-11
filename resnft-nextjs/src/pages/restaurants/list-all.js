import { useState, useEffect } from "react";
import { getAllRestaurants } from "@/utils/utils";
import Link from "next/link";

const ListAllRestaurants = () => {
  const [restaurants, setRestaurants] = useState(null);

  useEffect(() => {
    getAllRestaurants().then((data) => {
      if (data) {
        setRestaurants(data);
      }
    });
  }, []);

  console.log(restaurants);

  return (
    <>
      <div className="Update-description">
        Reservations are aviable at the following restaurants:
        <br/><br/>
        {restaurants
          ? restaurants.users.map((restaurant) => (
            <div>
              <button className="Gen-Button">
                <Link href={`/restaurants/allReservations/${restaurant.pubKey}`}>
                  {restaurant.name}
                  <br />
                </Link>
              </button>
              <br/>
            </div>
            ))
          : ""}
      </div>
    </>
  );
};

export default ListAllRestaurants;
