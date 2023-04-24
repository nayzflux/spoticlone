import spotifyApi from "@/lib/spotify";
import { LOGIN_URL } from "@/lib/spotify";
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

// export const authOptions = {
//     // Configure one or more authentication providers
//     providers: [
//         SpotifyProvider({
//             clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//             clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//             authorization: LOGIN_URL
//         })
//         // ...add more providers here
//     ],
//     secret: process.env.JWT_SECRET
// }

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const {body: refreshedToken} = await spotifyApi.refreshAccessToken();

        console.log("TOKENS REFRESHED");

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            refreshedToken: refreshedToken.refresh_token ?? token.refreshToken,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000
        }
    } catch (err) {
        console.error(err);
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        })
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // initial sign in
            if (account && user) {
                return ({
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000
                })
            }

            // if token not expired
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // access token expired
            return await refreshAccessToken(token)
        },
        async session({session, token}) {
            // saved on client side
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session;
        }
    }
});