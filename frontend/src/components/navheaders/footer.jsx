import React from 'react';
import { Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-white text-black">
            {/* Top area */}
            <div className="max-w-[1591px] w-full mx-auto px-10 py-10">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
                    {/* Logos */}
                    <div className="flex items-center gap-4">
                        <img src="/images/iligancity.jpg" alt="Iligan City logo" className="h-16" />
                        <img src="/images/iligancityseal.png" alt="Iligan City seal" className="h-16" />
                    </div>

                    {/* Contact / Info columns */}
                    <div className="flex flex-wrap gap-12">
                        <div className="w-[250px] text-sm">
                            <h3 className="font-bold text-base mb-2">Iligan City Hall</h3>
                            <p>Buhangin Hills, Palao, Iligan City, Philippines 9200</p>
                        </div>

                        <div className="w-[300px] text-sm">
                            <h3 className="font-bold text-base mb-2">Office of the City Mayor</h3>
                            <div className="flex flex-row gap-1 mb-1">
                                <p>City Mayor:</p>
                                <a href="https://www.facebook.com/frederick.siao.7" className="text-blue-400 hover:underline">Frederick Siao</a>
                            </div>
                            <div className="flex flex-row gap-1 mb-1">
                                <p>City Administrator:</p>
                                <p className="text-blue-400 hover:underline">admin@email.com</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <p>Chief-of-Staff:</p>
                                <p className="text-blue-400 hover:underline">chiefofstaff@email.com</p>
                            </div>
                        </div>

                        <div className="w-[200px] text-sm">
                            <h3 className="font-bold text-base mb-2">Follow us!</h3>
                            <div className="flex flex-row gap-1 items-center mb-1">
                                <Facebook size={15}/>
                                <p className="text-blue-400 hover:underline">iReklamo Official</p>
                            </div>
                            <div className="flex flex-row gap-1 items-center">
                                <Twitter size={15}/>
                                <p className="text-blue-400 hover:underline">@ireklamo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="w-full bg-gray-300">
                <div className="max-w-[1591px] w-full mx-auto px-10 py-2 text-sm">
                    <p>This is just a copy for academic fulfillment purposes only</p>
                </div>
            </div>
        </footer>
    );
}