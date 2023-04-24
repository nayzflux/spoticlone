import { playlistIdState, playlistState } from '@/atoms/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import { HomeIcon, MagnifyingGlassIcon, BuildingLibraryIcon, RssIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon, HeartIcon } from '@heroicons/react/24/solid';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    // 2:28
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
                setPlaylistId(data.body.items[0].id);
            });
        }
    }, [session, spotifyApi]);

    return (
        <div className='text-gray-400 font-semibold p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-100'>
            <div className='space-y-4'>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className='h-5 w-5 ' />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <MagnifyingGlassIcon className='h-5 w-5 ' />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <BuildingLibraryIcon className='h-5 w-5 ' />
                    <p>Your Library</p>
                </button>

                <hr className='border-t-[0.1px] border-gray-900 ' />

                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='h-5 w-5' />
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white '>
                    <HeartIcon className='h-5 w-5 fill-blue-600' />
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='h-5 w-5 ' />
                    <p>Your episodes</p>
                </button>

                <hr className='border-t-[0.1px] border-gray-900 ' />

                {/* Playlist display */}
                {playlists.map((pl) => {
                    return(
                        <p key={pl.id} onClick={() => setPlaylistId(pl.id)} className='cursor-pointer hover:text-white'>{pl.name}</p>
                    )
                })}
            </div>
        </div>
    );
}

export default Sidebar;