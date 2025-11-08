import { Facebook, Twitter } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full bg-white text-black">
            {/* Top area */}
            <div className="max-w-[1591px] w-full mx-auto px-10 py-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    {/* Logos */}
                    <div className="flex items-center gap-4">
                        <img src="/images/iligancity.jpg" alt="Iligan City logo" className="h-12" />
                        <img src="/images/iligancityseal.png" alt="Iligan City seal" className="h-12" />
                    </div>

                    {/* Contact / Info columns */}
                    <div className="flex flex-wrap gap-6">
                        <div className="w-[200px] text-xs">
                            <h3 className="font-bold">Iligan City Hall</h3>
                            <p>Buhangin Hills, Palao, Iligan City, Philippines 9200</p>
                        </div>

                        <div className="w-[250px] text-xs">
                            <h3 className="font-bold">Office of the City Mayor</h3>
                            <div className="flex flex-row gap-1">
                                <p>City Mayor:</p>
                                <a href="https://www.facebook.com/frederick.siao.7" className="text-blue-400 hover:underline">Frederick Siao</a>
                            </div>
                            <div className="flex flex-row gap-1">
                                <p>City Administrator:  </p>
                                <p className="text-blue-400 hover:underline">admin@email.com</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <p>Chief-of-Staff:</p>
                                <p className="text-blue-400 hover:underline">chiefofstaff@email.com</p>
                            </div>
                        </div>

                        <div className="w-[150px] text-xs">
                            <h3 className="font-bold">Follow us!</h3>
                            <div className="flex flex-row gap-1 items-center">
                                <Facebook size={13} />
                                <p className="text-blue-400 hover:underline">IliganComplaints</p>
                            </div>
                            <div className="flex flex-row gap-1 items-center">
                                <Twitter size={13} />
                                <p className="text-blue-400 hover:underline">@IliganComplaints</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="w-full bg-gray-300">
                <div className="max-w-[1591px] w-full mx-auto px-10 py-1 text-xs">
                <p>This is just a copy for academic fulfillment purposes only</p>
                </div>
            </div>
        </footer>
    );
}
