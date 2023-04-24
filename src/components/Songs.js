import { playlistState } from "@/atoms/playlistAtom";
import { useRecoilValue } from "recoil";
import Song from "./Song";

function Songs() {
    const playlist = useRecoilValue(playlistState);

    return (
        <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
            {playlist?.tracks.items.map((item, i) => {
                return (<Song key={item.track.id} track={item.track} order={i}/>)
            })}
        </div>
    );
}

export default Songs;