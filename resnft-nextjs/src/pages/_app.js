import "@/styles/globals.css";
import Layout from "@/layout/Layout";
import * as fcl from "@onflow/fcl";
import { AuthWrapper, ProfileWrapper } from "@/contexts/AuthContext";
import { NewReservationsWrapper } from "@/contexts/CreateNewReservationsContext";
import { useRouter } from "next/router";

fcl
  .config()
  .put("app.detail.title", "NFT Dapp")
  .put("app.detail.icon", "https://i.imgur.com/9I6NRUm.png")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

export default function App({ Component, pageProps }) {
  const router = useRouter();
  console.log(router.pathname);
  if (router.pathname == "/") return <Component {...pageProps} />;

  return (
    // Whatever...
    <AuthWrapper>
      <ProfileWrapper>
        <NewReservationsWrapper>
          <div className="site">
          <Layout>
            <div className="main">
              <Component {...pageProps} />
            </div>
          </Layout>
          </div>
        </NewReservationsWrapper>
      </ProfileWrapper>
    </AuthWrapper>
  );
}
