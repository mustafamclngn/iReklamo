export default function Footer() {
    return (
        <div>
            <div className="flex flex-row justify-between items-center px-20">
                <div className='bg-white p-5 px-20'>
                    <button><img src={'/images/iligancity.jpg'} className="h-10"/></button>
                    <button><img src={'/images/iligancityseal.png'} className='h-10 pl-5'/> </button>
                </div>
                <div className="w-40 text-black text-xs">
                    <h1 className="font-bold">Iligan City Hall</h1>
                    <p>Buhangin Hills, Palao, Iligan City, Philippines 9200</p>
                </div>
                <div className="w-40 text-black text-xs">
                    <h1 className="font-bold">Office of the City Mayor</h1>
                    <p>City Mayor: </p>
                    <p>City Administrator: </p>
                    <p>Chief-of-Staff: </p>
                </div>
                <div className="w-40 text-black text-xs">
                    <h1 className="font-bold">Follow us!</h1>
                    <p>Facebook: </p>
                    <p>Twitter: </p>
                </div>
            </div>
        
            <div className="text-black text-sm bg-gray-300 font-light h-5 flex justify-between items-center px-4 px-20">
                <h1 className="text-xs">This is just a copy for academic fulfillment purposes only</h1>
            </div>
        </div>

    );
}