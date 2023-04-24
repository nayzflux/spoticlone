import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSongInfo from "@/hooks/useSongInfo";
import useSpotify from "@/hooks/useSpotify";
import { useCallback, useEffect, useState } from "react";
import { debounce } from 'lodash'
import { useRecoilState } from "recoil";
import { session } from 'next-auth/react';
import { BackwardIcon, ForwardIcon, PauseCircleIcon, ArrowPathRoundedSquareIcon, ArrowsRightLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { milliisToMinutesAndSecondes } from "@/lib/time";

function Player() {
    const spotifyApi = useSpotify();
    const songInfo = useSongInfo();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(null);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data?.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data?.body?.is_playing);
                    setRepeat(data?.body?.repeat_state === "context" ? true : false)
                    setShuffle(data?.body?.shuffle_state)
                    setPlaybackTime(data?.body?.progress_ms);
                })
            })
        }
    }

    useEffect(() => {
        setTimeout(() => {
            const c = playbackTime;
            setPlaybackTime(c + 1000);
          }, 1000);
    }, [playbackTime])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
        }
    }, [currentTrackId, spotifyApi, session]);

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data?.body?.is_playing) {
                spotifyApi.pause().catch((err) => {
                    if (err.body.error.status === 403) {
                        alert("You must have Spotify PREMIUM!");
                        return;
                    }
                })
            } else {
                spotifyApi.play().catch((err) => {
                    if (err.body.error.status === 403) {
                        alert("You must have Spotify PREMIUM!");
                        return;
                    }
                })
            }

            setIsPlaying(!(data?.body?.is_playing) || false)
        })
    }

    const handleShuffle = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data?.body?.shuffle_state) {
                spotifyApi.setShuffle(false).catch((err) => {
                    if (err.body.error.status === 403) {
                        alert("You must have Spotify PREMIUM!");
                        return;
                    }
                })
            } else {
                spotifyApi.setShuffle(true).catch((err) => {
                    if (err.body.error.status === 403) {
                        alert("You must have Spotify PREMIUM!");
                        return;
                    }
                })
            }

            setShuffle(!(data?.body?.shuffle_state) || false)
        })
    }

    const handleRepeat = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data?.body?.repeat_state === "context" || data?.body?.repeat_state === "track") {
                spotifyApi.setRepeat(false).catch((err) => {
                    if (err.body.error.status === 403) {
                        alert("You must have Spotify PREMIUM!");
                        return;
                    }
                })
            } else {
                spotifyApi.setRepeat(true).catch((err) => {
                    if (err.body.error.status === 403) {
                        alert("You must have Spotify PREMIUM!");
                        return;
                    }
                })
            }

            setRepeat(data?.body?.repeat_state === "context" ? false : true || false)
        })
    }

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustedVolume(volume);
        }
    }, [volume]);

    const debouncedAdjustedVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(err => {
                if (err.body.error.status === 403) {
                    alert("You must have Spotify PREMIUM!");
                    return;
                }
            });
        }, 500), []
    )

    return (
        <div className='h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base md:px-8'>
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img src={songInfo?.album.images?.[0]?.url} alt="current track image" className="hidden md:inline h-20 w-20" />
                <div>
                    <h3 className="font-bold w-40 sm:w-60 lg:w-80 xl:w-max truncate">{songInfo?.name}</h3>
                    <p className="text-gray-400">{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            {/* center */}
            <div className="flex flex-col items-center justify-evenly">
                <div className="flex flex-row items-center space-x-1 sm:space-x-4">
                    {shuffle ? <ArrowsRightLeftIcon onClick={handleShuffle} className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out fill-green-500" /> : <ArrowsRightLeftIcon onClick={handleShuffle} className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out fill-gray-300" />}
                    <BackwardIcon className="h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-100 ease-out fill-gray-300" />
                    {(!isPlaying) ? <PlayCircleIcon className="h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" onClick={handlePlayPause} /> : <PauseCircleIcon className="h-10 w-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" onClick={handlePlayPause} />}
                    <ForwardIcon className="h-8 w-8 cursor-pointer hover:scale-125 transition transform duration-100 ease-out fill-gray-300" />
                    {repeat ? <ArrowPathRoundedSquareIcon onClick={handleRepeat} className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out fill-green-500" /> : <ArrowPathRoundedSquareIcon onClick={handleRepeat} className="h-5 w-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out fill-gray-300" />}
                </div>
                <div className="flex flex-row items-center justify-evenly w-auto sm:w-full space-x-2">
                    <span>{milliisToMinutesAndSecondes(playbackTime)}</span>
                    <input className="h-1 accent-gray-300 hover:accent-green-500 cursor-pointer w-auto sm:w-full" type="range" value={playbackTime} min={0} max={songInfo?.duration_ms}></input>
                    <span>{milliisToMinutesAndSecondes(songInfo?.duration_ms)}</span>
                </div>
            </div>

            {/* right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end">
                <SpeakerWaveIcon className="h-5 w-5" />
                <input className="w-14 md:w-28 accent-gray-300 hover:accent-green-500 cursor-pointer" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))}></input>
            </div>
        </div>
    );
}

export default Player;