import { currentTrackIdState } from "@/atoms/songAtom";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import SpotifyWebApi from "spotify-web-api-node";
import useSpotify from "./useSpotify";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSongInfo() {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
                const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                    }
                }).then(res => res.json());
                setSongInfo(trackInfo)
            }
        }

        fetchSongInfo();
    }, [currentTrackId, spotifyApi]);

    return songInfo;
}

export default useSongInfo;