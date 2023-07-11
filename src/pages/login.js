import { getProviders, signIn } from 'next-auth/react'

function Login({ providers }) {
    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center gap-6'>
            <img className='w-52 mb-5' src='https://links.papareact.com/9xl' alt='spotify logo'></img>
            <p className="text-white font-medium">This site is not the official Spotify Website, it's a clone to learn React & Netxt.</p>
            <a href="https://spotify.com" className="text-blue-600 hover:underline">You search the official site of Spotify? Click Here.</a>
            {Object.values(providers).map((provider) => <div key={provider.name}><button onClick={() => signIn(provider.id, {callbackUrl: "/"})} className='bg-[#18D860] text-white p-5 rounded-full'>Login with {provider.name}</button></div>)}
        </div>
    );
}

export default Login;

export async function getServerSideProps() {
    const providers = await getProviders();
    return ({
        props: {
            providers
        }
    })
}
