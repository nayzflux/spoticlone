import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { milliisToMinutesAndSecondes } from "@/lib/time";
import { useRecoilState } from "recoil";

function Song({ order, track }) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        setCurrentTrackId(track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.uri],
        }).catch(err => {
            if (err.body.error.status === 403) {
                alert("You must have Spotify PREMIUM!");
                return;
            }
        })
    }

    return (
        <div className={track.id !== currentTrackId ? 'grid grid-cols-2 text-gray-400 py-2 px-5 hover:bg-gray-800 rounded-lg hover:text-white' : 'grid grid-cols-2 text-white py-2 px-5 bg-gray-400 rounded-lg'} onClick={playSong} >
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img src={track.album.images[0].url} className="h-10 w-10"></img>
                <div>
                    <p className="w-36 lg:w-64 text-white truncate font-bold">{track.name}</p>
                    <p className="w-40">{track.artists[0].name}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 truncate hidden md:inline">{track.album.name}</p>
                <p>{milliisToMinutesAndSecondes(track.duration_ms)}</p>
            </div>
        </div>
    );
}

export default Song;