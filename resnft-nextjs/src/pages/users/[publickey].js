import { useState, useEffect } from "react";
import GetNFTByOwner from "../../components/nfts/GetNFTByOwner";
import { useRouter } from "next/router";
import { fetchProfile } from "@/utils/utils";
import Link from "next/link";

const UserProfile = () => {
  const router = useRouter();
  const { publickey } = router.query;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (publickey) {
      fetchProfile({ addr: publickey }).then((data) => {
        if (data) {
          setProfile(data.user);
        }
      });
    }
  }, [publickey]);

  if (!profile) {
    return (
      <div className="Description">
        Your wallet does not have a profile yet.
        <br />
        <br />
        If you would like to create your profile, click{" "}
        <Link href="/users/update-profile">here</Link>.
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="center-page-title">
        <h1>User Profile</h1>
      </div>
      <h2>Public Key: {profile.pubKey}</h2>
      <br />
      <h2> Name: {profile.name} </h2>
      <br />
      <h2> Email: {profile.email} </h2>
      <br />
      <h2> Phone: {profile.phone} </h2>
      <br />
      <h2> Location: {profile.location} </h2>
      <br />
      {profile.isRestaurant ? (
        <>
          <h2> Menu: {profile.menu} </h2>
          <br />
          <h2> Description: {profile.description} </h2>
          <br />
        </>
      ) : (
        ""
      )}

      <h2>
       NFTs Owned: <GetNFTByOwner addr={profile.pubKey} />
      </h2>
    </div>
  );
};

export default UserProfile;
